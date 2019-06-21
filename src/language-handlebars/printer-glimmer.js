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

function testGroup() {
  return group(
    concat([
      "111",
      " ",
      fill(
        ["aaa", line, "bbb", line, "ccc", line, "ddd"]
      ),
      " ",
      fill(
        ["aaa", line, "bbb", line, "ccc", line, "ddd"]
      ),
      " ",
      fill(
        ["aaa", line, "bbb", line, "ccc", line, "ddd"]
      ),
      " ",
      fill(
        ["aaa", line, "bbb", line, "ccc", line, "ddd"]
      ),
      " ",
      fill(
        ["aaa", line, "bbb", line, "ccc", line, "ddd"]
      ),
      " ",
      "222"
    ])
  );

}

function print(path, options, print) {
  const node = path.getValue();

  switch (node.type) {
    case "Block":
    case "Program":
    case "Template": {
      return concat([
        printChildren(path, options, print, "body"),
        hardline
      ]);
    }
    case "ElementNode": {
      return "[ELEMENT]"
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
      return "[AttrNode]"
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

      return group(
        fill(
          parts
        )
      );
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
  return text.replace(/^\s+/,"").replace(/\s+$/,"").split(/\s+/);
}

function injectLines(items) {
  let newItems = [];
  for(let i=0; i<items.length; i++) {
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
