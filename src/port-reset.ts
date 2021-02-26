#!/usr/bin/env node

import { cleanFirewallRules, resetPortProxy } from "./sys-commands";

resetPortProxy();
cleanFirewallRules();
