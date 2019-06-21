"use strict";

const {
  concat,
  join,
  softline,
  hardline,
  line,
  group,
  indent,
  ifBreak
} = require("../doc").builders;

function print(path, options, print) {
  const node = path.getValue();

  switch (node.type) {
    case "Block":
    case "Program":
    case "Template": {
      return "[Block|Program|Template]";
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
      return "[TextNode]";
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

function printChildren(path, options, print) {
  return concat(
    path.map((childPath, _childIndex) => {
      return print(childPath, options, print);
    }, "children")
  );
}

module.exports = {
  print
};
