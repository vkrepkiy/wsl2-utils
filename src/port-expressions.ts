export type PortMap = [number, number];

export function parsePortExpressionList(portExpressions: string[]): PortMap[] {
  return portExpressions.reduce((r, expr) => {
    const portMapList = parseExpression(expr);
    if (portMapList) {
      r = r.concat(portMapList);
    }
    return r;
  }, <PortMap[]>[]);
}

function parseExpression(expression: string): PortMap[] | null {
  /**
   * Parse range
   */
  if (expression.includes("-")) {
    return parsePortRangeExpression(expression);
  }

  /**
   * Parse map
   */
  if (expression.includes(":")) {
    const map = parsePortMapExpression(expression);
    return map ? [map] : null;
  }

  return isNaN(+expression) ? null : [[+expression, +expression]];
}

function parsePortRangeExpression(port: string): PortMap[] | null {
  const [from, to] = port.split("-");

  if (!isNaN(+from) && !isNaN(+to)) {
    return new Array(+to - +from + 1)
      .fill(null)
      .map((_, i) => [+from + i, +from + i]);
  }

  return null;
}

function parsePortMapExpression(port: string): PortMap | null {
  const [host, target] = port.split(":");

  if (!isNaN(+host) && !isNaN(+target)) {
    return [+host, +target];
  }

  return isNaN(+host) ? null : [+host, +host];
}
