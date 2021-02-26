#!/usr/bin/env node

import { parsePortExpressionList } from "./port-expressions";
import { setFirewallRule, addPortProxyV4, getIpAddrV4 } from "./sys-commands";

const ipAddr = getIpAddrV4();

if (!ipAddr) {
  console.error(`cannot detect WSL2 ip addr`);
  process.exit(1);
}

const portMaps = parsePortExpressionList(process.argv.slice(2));

if (portMaps.length < 1) {
  console.warn(`No ports provided`);
  process.exit(1);
}

console.debug(
  `Binding these ports on ${ipAddr}: \n${portMaps
    .map((pm) => pm.join(" --> "))
    .join("\n")}`
);

addPortProxyV4(ipAddr, portMaps);
setFirewallRule(portMaps);
