# [@vkrepkiy/wsl2-utils](https://github.com/vkrepkiy/wsl2-utils)

WSL2-utils is a package made for a personal usage to improve web dev experience under WSL2.

## port-forward

Shorthand for `netsh.exe interface portproxy add v4tov4`. When launched under WSL2 it detects IP address and binds ports.
The following port syntax available:

- ${LISTEN_AND_CONNECT_PORT}
- ${LISTENT_PORT}:${CONNECT_PORT}
- ${LISTEN_AND_CONNECT_PORT_FROM}:${LISTEN_AND_CONNECT_PORT_TO}

This example will rewire 8080 to 9000, forward 6000 to 6000 and all ports in range [from 9005 to 9010] to [from 9005 to 9010].

`port-forward 6000 8080:9000 9005-9010`

## port-reset (netsh reset)

Use this to reset all port forwarding, it simply calls `netsh.exe interface portproxy reset`.
