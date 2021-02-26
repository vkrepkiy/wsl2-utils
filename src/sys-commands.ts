import { execSync } from "child_process";
import { PortMap } from "./port-expressions";

/**
 * All created rules in win firewall should have this prefix
 */
export const firewallRulePrefix = "vkrepkiy-wsl2-utils";

/**
 * Grep ip address.
 */
export function getIpAddrV4(): string | null {
  try {
    return execSync(
      `ip -4 addr show scope global | grep -Eo '[[:digit:]]{1,3}\.[[:digit:]]{1,3}\.[[:digit:]]{1,3}\.[[:digit:]]{1,3}' | head -1`
    )
      .toString()
      .trim();
  } catch (e) {
    return null;
  }
}

/**
 * Run port binding for provided port map list
 */
export function addPortProxyV4(
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
 * Reset port proxy
 */
export function resetPortProxy() {
  execSync(`netsh.exe interface portproxy reset`);
}

/**
 * Open ports in windows firewall
 */
export function setFirewallRule(
  portMap: PortMap[],
  profile: string = `@('Domain', 'Private')`
) {
  // Clean possible duplicates
  execSync(
    `powershell.exe -command "& ${cmdToRemoveFirewallRules(
      portMap
    )}" 2>&1 >/dev/null`
  );

  // Create new rules
  execSync(
    `powershell.exe -command "& ${cmdToAddFirewallRules(portMap, profile)}"`
  );
}

/**
 * Clean all firewall rules created by this utility
 */
export function cleanFirewallRules() {
  execSync(
    `powershell.exe -command "& Remove-NetFirewallRule -DisplayName '${firewallRulePrefix}' *"`
  );
}

function cmdToRemoveFirewallRules(portMap: PortMap[]) {
  const cmdBase = "Remove-NetFirewallRule -DisplayName";
  return [
    `${cmdBase} '${getFirewallRuleName(portMap, "Inbound")}'`,
    `${cmdBase} '${getFirewallRuleName(portMap, "Outbound")}'`,
  ].join("; ");
}

function cmdToAddFirewallRules(portMap: PortMap[], profile: string) {
  const cmdBase = "New-NetFirewallRule -DisplayName";
  const cmdParams = `-LocalPort ${getExternalPorts(
    portMap
  )} -Action Allow -Protocol TCP  -Profile ${profile}`;
  return [
    `${cmdBase} '${getFirewallRuleName(
      portMap,
      "Inbound"
    )}' -Direction Inbound ${cmdParams}`,
    `${cmdBase} '${getFirewallRuleName(
      portMap,
      "Outbound"
    )}' -Direction Outbound ${cmdParams}`,
  ].join("; ");
}

/**
 * Generate rule name based on fixed pattern
 */
function getFirewallRuleName(
  portMap: PortMap[],
  dir: "Outbound" | "Inbound"
): string {
  const externalPorts = getExternalPorts(portMap);
  return `${firewallRulePrefix} ${dir} ${externalPorts}`;
}

/**
 * Convert PortMap list to comma-separated sorted external port string
 */
function getExternalPorts(portMap: PortMap[]) {
  return portMap
    .map((x) => +x[0])
    .sort()
    .join(",");
}
