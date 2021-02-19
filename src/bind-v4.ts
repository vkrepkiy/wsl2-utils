#!/usr/bin/env node

import { addV4ToV4, getV4IpAddr, parsePortExpressionList } from "./utils";

const ipAddr = getV4IpAddr();
const ports = parsePortExpressionList(process.argv.slice(2));

if (ports.length < 1) {
  console.warn(`No ports provided, nothing is done`);
} else {
  console.info(`Binding these ports: ${ports} on ${ipAddr}`);
}

addV4ToV4(ipAddr, ports);
