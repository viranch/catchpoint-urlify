/*
Author: Viranch Mehta
Email: email@viranch.me
*/

// 1. Loop through all anchor tags
// 2. Clean URLs that match our radar

var inject = '(' + function() {
    var observeDOM = (function(){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function(obj, callback){
            if( MutationObserver ){
                // define a new observer
                var obs = new MutationObserver(function(mutations, observer){
                    if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                        callback();
                });
                // have the observer observe foo for changes in children
                obs.observe( obj, { childList:true, subtree:true });
            }
            else if( eventListenerSupported ){
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    })();
    var sanitize = function() {
        var anchors = document.getElementsByTagName('a');
        for (var i in anchors) {
            var a = anchors[i];
            try {
                var old_href = a.getAttribute('href');
                if (old_href != null && old_href != '#' && !old_href.startsWith('javascript:')) continue;

                var aclass = a.getAttribute('class');

                if (aclass.startsWith('TestStructure_0 nodeStyle test-tree-node TestStructure_1')) {
                    // sidebar
                    var tokens = a.href.split(',');
                    tokens = tokens[tokens.length - 1].split("'")[1].split('\\');
                    var thing = tokens[tokens.length - 1];
                    if (thing.startsWith('F')) {
                        a.href = "TestModuleList.aspx?folderId=" + thing.slice(1);
                    } else if (thing.startsWith('P')) {
                        a.href = "TestModuleList.aspx?productId=" + thing.slice(1);
                    }
                } else if (aclass.startsWith('name-lnk item-ico-lnk-')) {
                    // main view
                    var prefix = "TestDetail.aspx?id=";
                    if (a.classList.contains('item-ico-lnk-folder')) {
                        prefix = "TestModuleList.aspx?folderId=";
                    } else if (a.classList.contains('item-ico-lnk-product')) {
                        prefix = "TestModuleList.aspx?productId=";
                    }
                    var name = a.href.split("'")[1].replace('NameAction', 'ElementId');
                    a.href = prefix + theForm[name].value;
                } else if (aclass.startsWith('more-lnk ') || aclass == 'dbd-test-name') {
                    var onclick = a.getAttribute('onclick');
                    if (onclick.indexOf("location.href ='") !== -1 || onclick.indexOf("location.href='") !== -1) {
                        a.href = onclick.split("'")[1];
                    }
                }

                if (aclass == 'dbd-test-name') {
                    console.log('----');
                    console.log(old_href);
                    console.log(a.href);
                }

                if (old_href != a.href) {
                    // house cleaning
                    a.setAttribute('dontclick', a.getAttribute('onclick'));
                    a.removeAttribute('onclick');
                    //console.log(a.href);
                }
            } catch (e) {
                //console.log(e);
            }
        }
    };
    observeDOM(document.getElementsByTagName('body')[0], sanitize);
} + ')();';

var script = document.createElement('script');
script.textContent = inject;
(document.head||document.documentElement).appendChild(script);
