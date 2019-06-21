"use strict";

const {
  concat,
  join,
  softline,
  hardline,
  line,
  group,
  indent,
  ifBreak,
  fill
} = require("../doc").builders;

// http://w3c.github.io/html/single-page.html#void-elements
const voidTags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];

function print(path, options, print) {
  const node = path.getValue();

  switch (node.type) {
    case "Block":
    case "Program":
    case "Template": {
      return concat([printChildren(path, options, print, "body"), hardline]);
    }
    case "ElementNode": {
      const isVoid = voidTags.includes(node.tag);
      const lineType = hardline;

      const getParams = (path, print) => {
        return indent(
          concat([
            node.attributes.length ? line : "",
            join(line, path.map(print, "attributes"))
          ])
        );
      }

      const params = getParams(path, print);

      if (isVoid) {
        return group(concat(["<", node.tag, params, " />"]));
      } else {
        return concat([
          group(concat(["<", node.tag, params, ">"])),
          group(
            concat([
              indent(concat([lineType, printChildren(path, options, print)])),
              lineType,
              concat(["</", node.tag, ">"])
            ])
          )
        ]);
      }
    }
    case "BlockStatement": {
      return "[BlockStatement]";
    }
    case "ElementModifierStatement":
    case "MustacheStatement": {
      return "[ElementModifierStatement|MustacheStatement]";
    }
    case "SubExpression": {
      return "[SubExpression]";
    }
    case "AttrNode": {
      const isText = node.value.type === "TextNode";
      if (isText && node.value.loc.start.column === node.value.loc.end.column) {
        return concat([node.name]);
      }
      const quote = isText ? '"' : "";
      return concat([node.name, "=", quote, path.call(print, "value"), quote]);
    }
    case "ConcatStatement": {
      return "[ConcatStatement]";
    }
    case "Hash": {
      return "[Hash]";
    }
    case "HashPair": {
      return "[HashPair]";
    }
    case "TextNode": {
      let parts = splitByWhitespaceAndTrim(node.chars);
      parts = injectLines(parts);

      return group(fill(parts));
    }
    case "MustacheCommentStatement": {
      return "[MustacheCommentStatement]";
    }
    case "PathExpression": {
      return "[PathExpression]";
    }
    case "BooleanLiteral": {
      return "[BooleanLiteral]";
    }
    case "CommentStatement": {
      return "[CommentStatement]";
    }
    case "StringLiteral": {
      return "[StringLiteral]";
    }
    case "NumberLiteral": {
      return "[NumberLiteral]";
    }
    case "UndefinedLiteral": {
      return "[UndefinedLiteral]";
    }
    case "NullLiteral": {
      return "[NullLiteral]";
    }

    /* istanbul ignore next */
    default:
      throw new Error("unknown glimmer type: " + JSON.stringify(n.type));
  }
}

function printChildren(path, options, print, key = "children") {
  return group(
    join(
      softline,
      path.map((childPath, _childIndex) => {
        return print(childPath, options, print);
      }, key)
    )
  );
}

function splitByWhitespaceAndTrim(text) {
  return text
    .replace(/^\s+/, "")
    .replace(/\s+$/, "")
    .split(/\s+/);
}

function injectLines(items) {
  let newItems = [];
  for (let i = 0; i < items.length; i++) {
    if (i !== 0) {
      newItems.push(line);
    }
    newItems.push(items[i]);
  }

  return newItems;
}

module.exports = {
  print
};
