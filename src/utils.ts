import { execSync } from "child_process";

export function parsePortExpressionList(list: string[]): number[] {
  return list.reduce((r, p) => r.concat(parsePort(p)), <number[]>[]);
}

export function parsePort(port: string): number[] {
  const [from, to] = port.split("-");

  if (from && to) {
    if (isNaN(+from) || isNaN(+to)) {
      return [0];
    }
    return new Array(+to - +from + 1).fill(null).map((_, i) => +from + i);
  }

  return isNaN(+from) ? [0] : [+from];
}

/**
 * Read current local ip address
 */
export function getV4IpAddr(): string {
  try {
    return execSync(
      `ip addr | grep -Eo 'inet (192|172|10)\.[[:digit:]]{1,3}\.[[:digit:]]{1,3}\.[[:digit:]]{1,3}'`
    )
      .toString()
      .substr(5);
  } catch (e) {
    throw `cannot detect WSL ip addr`;
  }
}

/**
 * Run symmetric port binding for provided port list
 */
export function addV4ToV4(
  ipConnect: string,
  ports: (string | number)[],
  ipListen = "0.0.0.0"
) {
  const command = ports
    .map((port) => {
      return `bash.exe -c "netsh.exe interface portproxy add v4tov4 listenport=${port} listenaddress=${ipListen} connectport=${port} connectaddress=${ipConnect}"`;
    })
    .join(" & ");

  execSync(`${command}`);
}

export function deleteV4ToV4(
  ipConnect: string,
  ports: (string | number)[],
  ipListen = "0.0.0.0"
) {
  const command = ports
    .map((port) => {
      return `bash.exe -c "netsh.exe interface portproxy delete v4tov4 listenport=${port} listenaddress=${ipListen}"`;
    })
    .join(" & ");

  execSync(`${command}`);
}
