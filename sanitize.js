/*
Author: Viranch Mehta
Email: email@viranch.me
*/

// 1. Loop through all anchor tags
// 2. Clean URLs that match our radar

var inject = '(' + function() {
    var anchors = document.getElementsByTagName('a');
    for (var i in anchors) {
        var a = anchors[i];
        try {
            if (a.href != null && !a.href.startsWith('javascript:')) continue;

            var aclass = a.getAttribute('class');
            var old_href = a.href;

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
            }

            if (old_href != a.href) {
                // house cleaning
                a.setAttribute('dontclick', a.getAttribute('onclick'));
                a.removeAttribute('onclick');
                console.log(a.href);
            }
        } catch (e) {
            console.log(e);
        }
    }
} + ')();';

var script = document.createElement('script');
script.textContent = inject;
(document.head||document.documentElement).appendChild(script);
