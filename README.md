# [@vkrepkiy/wsl2-utils](https://github.com/vkrepkiy/wsl2-utils)

WSL2-utils is a package initially made for a personal usage to improve web dev experience under WSL2.

Example: `npx @vkrepkiy/wsl2-utils port-forward 9000`

## port-forward

Bind ports, set firewall rules. The following port syntax is available:

- ${LISTEN_AND_CONNECT_PORT}
- ${LISTENT_PORT}:${CONNECT_PORT}
- ${LISTEN_AND_CONNECT_PORT_FROM}:${LISTEN_AND_CONNECT_PORT_TO}

This example will rewire 8080 to 9000, forward 6000 to 6000 and all ports in range [from 9005 to 9010] to [from 9005 to 9010].

`port-forward 6000 8080:9000 9005-9010`

## port-reset

- Reset all port forwarding (it simply calls `netsh.exe interface portproxy reset`).
- Clean all firewall rules created by this utility.
