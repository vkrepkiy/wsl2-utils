import { execSync } from "child_process";
import { PortMap } from "./port-expressions";

/**
 * Grep ip address.
 * @throws
 *
 * WARNING: suitable only for the default network configuration.
 */
export function getIpAddrV4(): string | null {
  try {
    return execSync(
      `ip addr | grep -Eo 'inet (192|172|10)\.[[:digit:]]{1,3}\.[[:digit:]]{1,3}\.[[:digit:]]{1,3}'`
    )
      .toString()
      .substr(5)
      .trim();
  } catch (e) {
    return null;
  }
}

/**
 * Run port binding for provided port map list
 */
export function addV4ToV4(
  targetIp: string,
  portMap: PortMap[],
  hostIp = "0.0.0.0"
) {
  const command = portMap
    .map(([listenPort, connectPort]) => {
      return `bash.exe -c "netsh.exe interface portproxy add v4tov4 listenport=${listenPort} listenaddress=${hostIp} connectport=${connectPort} connectaddress=${targetIp}"`;
    })
    .join(" & ");

  execSync(`${command}`);
}

/**
 * Reset ports
 */
export function reset() {
  execSync(`netsh.exe interface portproxy reset`);
}