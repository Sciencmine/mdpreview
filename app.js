var app = new Vue({
    el: "#app",
    data: {
        urlInput: "",
        source: "",
        compiled: "",
        statusCode: 200,
        options: {
            showSource: false,
            shouldSanitize: true,
            showControl: true,
            showCredit: true,
            langChoice: "English",
            hlStyle: "github-gist",
            hlSupport: "1"
        },
        i18n: {},
        langs: [{
                displayName: "English",
                id: "en_us",
                content: {
                    title: "Markdown Preview",
                    language: "Language: ",
                    highlightStyle: "Highlight Style: ",
                    highlightSupport: "Highlight Support Level: ",
                    mdUrl: "Markdown File URL: ",
                    load: "Load",
                    source: "Show Source",
                    sanitize: "Sanitize HTML",
                    poweredBy: "Powered By: ",
                    connectionFailure: "Connection failed",
                    connectionError: "Error ",
                    langUnknown: "Unknown language!",
                    styleUnknown: "Unknown style!",
                    hlLevelUnknown: "Unknown highlight support level!",
                    queryParseError: "Error when parsing queries!",
                    queryUnknownKey: "Unknown query key: "
                }
            },
            {
                displayName: "简体中文",
                id: "zh_cn",
                content: {
                    title: "Markdown 预览",
                    language: "语言：",
                    highlightStyle: "高亮样式：",
                    highlightSupport: "高亮支持等级：",
                    mdUrl: "Markdown 文件 URL：",
                    load: "加载",
                    source: "显示源代码",
                    sanitize: "净化 HTML",
                    poweredBy: "技术支持：",
                    connectionFailure: "连接失败",
                    connectionError: "错误 ",
                    langUnknown: "未知语言！",
                    styleUnknown: "未知样式！",
                    hlLevelUnknown: "未知高亮支持等级！",
                    queryParseError: "解析请求时出错！",
                    queryUnknownKey: "未知请求键值："
                }
            },
            {
                displayName: "繁體中文",
                id: "zh_tw",
                content: {
                    title: "Markdown 預覽",
                    language: "語言：",
                    highlightStyle: "高亮樣式：",
                    highlightSupport: "高亮支持等級：",
                    mdUrl: "Markdown 檔案 URL：",
                    load: "加載",
                    source: "顯示源代碼",
                    sanitize: "淨化 HTML",
                    poweredBy: "技術支持：",
                    connectionFailure: "連接失敗",
                    connectionError: "錯誤 ",
                    langUnknown: "未知語言！",
                    styleUnknown: "未知樣式！",
                    hlLevelUnknown: "未知高亮支持等級！",
                    queryParseError: "解析請求時出錯！",
                    queryUnknownKey: "未知請求鍵值："
                }
            }
        ],
        hlStyles: [
            "a11y-dark",
            "a11y-light",
            "agate",
            "an-old-hope",
            "androidstudio",
            "arduino-light",
            "arta",
            "ascetic",
            "atelier-cave-dark",
            "atelier-cave-light",
            "atelier-dune-dark",
            "atelier-dune-light",
            "atelier-estuary-dark",
            "atelier-estuary-light",
            "atelier-forest-dark",
            "atelier-forest-light",
            "atelier-heath-dark",
            "atelier-heath-light",
            "atelier-lakeside-dark",
            "atelier-lakeside-light",
            "atelier-plateau-dark",
            "atelier-plateau-light",
            "atelier-savanna-dark",
            "atelier-savanna-light",
            "atelier-seaside-dark",
            "atelier-seaside-light",
            "atelier-sulphurpool-dark",
            "atelier-sulphurpool-light",
            "atom-one-dark-reasonable",
            "atom-one-dark",
            "atom-one-light",
            "brown-paper",
            "brown-papersq",
            "codepen-embed",
            "color-brewer",
            "darcula",
            "dark",
            "darkula",
            "default",
            "docco",
            "dracula",
            "far",
            "foundation",
            "github-gist",
            "github",
            "gml",
            "googlecode",
            "gradient-dark",
            "grayscale",
            "gruvbox-dark",
            "gruvbox-light",
            "hopscotch",
            "hybrid",
            "idea",
            "ir-black",
            "isbl-editor-dark",
            "isbl-editor-light",
            "kimbie.dark",
            "kimbie.light",
            "lightfair",
            "magula",
            "mono-blue",
            "monokai-sublime",
            "monokai",
            "night-owl",
            "nord",
            "obsidian",
            "ocean",
            "paraiso-dark",
            "paraiso-light",
            "pojoaque",
            "purebasic",
            "qtcreator_dark",
            "qtcreator_light",
            "railscasts",
            "rainbow",
            "routeros",
            "school-book",
            "shades-of-purple",
            "solarized-dark",
            "solarized-light",
            "sunburst",
            "tomorrow-night-blue",
            "tomorrow-night-bright",
            "tomorrow-night-eighties",
            "tomorrow-night",
            "tomorrow",
            "vs",
            "vs2015",
            "xcode",
            "xt256",
            "zenburn"
        ],
        hlSupportLevels: [
            "1",
            "2",
            "3"
        ]
    },
    methods: {
        loadMd: function () {
            superagent.get(app.urlInput).end(function (error, response) {
                if (error !== null) {
                    alert(app.i18n.connectionFailure + "\n" + error);
                    return;
                }

                if (response.statusCode !== 200) {
                    alert(app.i18n.connectionError + response.statusCode + "\n\n" + response.text);
                }

                app.statusCode = response.statusCode, app.source = response.text;
                app.compile();
            });
        },
        compile: function () {
            var markedProcessed = marked(app.source);
            if (app.options.shouldSanitize) {
                app.compiled = DOMPurify.sanitize(markedProcessed);
            } else {
                app.compiled = markedProcessed;
            }
        },
        string2bool: function (value) {
            return value === "true" || value === "1";
        },
        loadQuery: function () {
            if (window.location.search.length > 1) {
                var searchList = "&" + window.location.search.substr(1);

                var i = 0,
                    j;
                for (var parseFinished = false; !parseFinished && i >= 0;) {
                    j = searchList.indexOf("=", i);
                    if (j === -1) {
                        alert(app.i18n.queryParseError);
                        break;
                    }

                    var key = searchList.substr(i + 1, j - i - 1);

                    i = searchList.indexOf("&", j);
                    if (i === -1) {
                        parseFinished = true;
                        i = searchList.length;
                    }

                    switch (key) {
                        case "source":
                            app.options.showSource = app.string2bool(searchList.substr(j + 1, i - j - 1));
                            break;
                        case "sanitize":
                            app.options.shouldSanitize = app.string2bool(searchList.substr(j + 1, i - j - 1));
                            break;
                        case "control":
                            app.options.showControl = app.string2bool(searchList.substr(j + 1, i - j - 1));
                            break;
                        case "credit":
                            app.options.showCredit = app.string2bool(searchList.substr(j + 1, i - j - 1));
                            break;
                        case "lang":
                            var langId = searchList.substr(j + 1, i - j - 1);
                            var k = 0;

                            for (; k < app.langs.length; k++) {
                                if (app.langs[k].id === langId) {
                                    app.options.langChoice = app.langs[k].displayName;
                                    break;
                                }
                            }

                            if (k === app.langs.length) {
                                alert(app.i18n.langUnknown);
                            }
                            break;
                        case "hlStyle":
                            app.options.hlStyle = searchList.substr(j + 1, i - j - 1);
                            break;
                        case "hlLevel":
                            var hlLevel = searchList.substr(j + 1, i - j - 1);
                            switch (hlLevel) {
                                case "1":
                                    app.options.hlSupport = "1";
                                    break;
                                case "2":
                                    app.options.hlSupport = "2";
                                    break;
                                case "3":
                                    app.options.hlSupport = "3";
                                    break;
                                default:
                                    alert(app.i18n.hlLevelUnknown);
                                    break;
                            }
                            break;
                        case "url":
                            i = "hasUrl";
                            break;
                        default:
                            alert(app.i18n.queryUnknownKey + key);
                            return;
                    }
                }

                if (i === "hasUrl") {
                    app.urlInput = unescape(searchList.substr(j + 1));
                    app.loadMd();
                }
            }
        },
        loadI18n: function () {
            for (var i = 0; i < app.langs.length; i++) {
                if (app.langs[i].displayName === app.options.langChoice) {
                    app.i18n = app.langs[i].content;
                    document.title = app.i18n.title;
                    return;
                }
            }

            alert(app.i18n.langUnknown);
        },
        loadHlStyle: function () {
            for (var i = 0; i < app.hlStyles.length; i++) {
                if (app.options.hlStyle === app.hlStyles[i]) {
                    document.getElementById("hlStyle").href = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/styles/" + app.options.hlStyle + ".min.css";
                    return;
                }
            }
            
            alert(app.i18n.styleUnknown);
            app.options.hlStyle = "github-gist";
            app.loadHlStyle();
        },
        loadHlSupport: function () {
            switch (app.options.hlSupport) {
                case "1":
                    document.getElementById("hlScript").href = "https://cdn.jsdelivr.net/gh/Sciencmine/mdpreview@master/hl/normal.min.js";
                    break;
                case "2":
                    document.getElementById("hlScript").href = "https://cdn.jsdelivr.net/gh/Sciencmine/mdpreview@master/hl/more.min.js";
                    break;
                case "3":
                    document.getElementById("hlScript").href = "https://cdn.jsdelivr.net/gh/Sciencmine/mdpreview@master/hl/full.min.js";
                    break;
                default:
                    alert(app.i18n.hlLevelUnknown);
                    app.options.hlSupport = "1";
                    app.loadHlSupport();
                    break;
            }
        },
        init: function () {
            marked.setOptions({
                highlight: function (code, language) {
                    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
                    return hljs.highlight(validLanguage, code).value;
                },
                gfm: true,
                smartLists: true,
                smartypants: false,
            });

            app.loadI18n();

            app.urlInput = "https://cdn.jsdelivr.net/gh/Sciencmine/mdpreview@latest/example.md";

            app.loadQuery();

            app.loadI18n();
            app.loadHlStyle();
            app.loadHlSupport();
        }
    }
});