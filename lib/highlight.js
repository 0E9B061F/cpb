const highlight = function(container, ...highlightText) {
  var internalHighlighter = function(options) {
    const tokens = options.tokens
    const allClassName = options.all.className
    const allSensitiveSearch = options.all.sensitiveSearch

    const spans = []

    function checkAndReplace(node, tokenArr, classNameAll, sensitiveSearchAll) {
      var nodeVal = node.nodeValue,
        parentNode = node.parentNode,
        i, j, curToken, myToken, myClassName, mySensitiveSearch,
        finalClassName, finalSensitiveSearch,
        foundIndex, begin, matched, end,
        textNode, span, isFirst;

      for (i = 0, j = tokenArr.length; i < j; i++) {
        curToken = tokenArr[i];
        myToken = curToken.token
        myClassName = curToken.className
        mySensitiveSearch = curToken.sensitiveSearch

        finalClassName = (classNameAll ? myClassName + " " + classNameAll : myClassName);

        finalSensitiveSearch = (typeof sensitiveSearchAll !== "undefined" ? sensitiveSearchAll : mySensitiveSearch);

        isFirst = true;
        while (true) {
          if (finalSensitiveSearch)
            foundIndex = nodeVal.indexOf(myToken);
          else
            foundIndex = nodeVal.toLowerCase().indexOf(myToken.toLowerCase());

          if (foundIndex < 0) {
            if (isFirst)
              break;

            if (nodeVal) {
              textNode = document.createTextNode(nodeVal);
              parentNode.insertBefore(textNode, node);
            } // End if (nodeVal)

            parentNode.removeChild(node);
            break;
          } // End if (foundIndex < 0)

          isFirst = false;


          begin = nodeVal.substring(0, foundIndex);
          matched = nodeVal.substr(foundIndex, myToken.length);

          if (begin) {
            textNode = document.createTextNode(begin);
            parentNode.insertBefore(textNode, node);
          } // End if (begin)

          span = document.createElement("span");
          span.className += finalClassName;
          span.appendChild(document.createTextNode(matched));
          spans.push(span)
          parentNode.insertBefore(span, node);

          nodeVal = nodeVal.substring(foundIndex + myToken.length);
        } // Whend

      } // Next i
    }; // End Function checkAndReplace

    function iterator(p) {
      if (p === null) return;

      var children = Array.prototype.slice.call(p.childNodes),
        i, cur;

      if (children.length) {
        for (i = 0; i < children.length; i++) {
          cur = children[i];
          if (cur.nodeType === 3) {
            checkAndReplace(cur, tokens, allClassName, allSensitiveSearch);
          } else if (cur.nodeType === 1) {
            iterator(cur);
          }
        }
      }
    }; // End Function iterator

    iterator(options.container)

    return spans
  } // End Function highlighter
  ;

  const tokens = highlightText.map((t, i) => {
    return {
      token: t,
      className: `highlight-${i+1}`,
      sensitiveSearch: false,
    }
  })

  return internalHighlighter({
    container: container,
    all: {
      className: "highlighted"
    },
    tokens: tokens
  }); // End Call internalHighlighter

} // End Function highlight

module.exports = highlight
