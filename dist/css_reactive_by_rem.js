(function (root, factory) {
    if (typeof module === 'object') {
        module.exports = factory(root)
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(root)
        })
    } else {
        root['cssReactiveByRem'] = factory(root)
    }
})(typeof window !== 'undefined' ? window : this, function (window) {

    var cssReactiveByRem = function (option) {
        if (typeof window === 'undefined') {
            throw new Error('The execution environment must be a environment of browser')
        }

        var defaultSettings = {
            moblieDesignWidth: 750,
            PCDesignWidth: 1920
        }


        var mergeSettings = extend(defaultSettings, option)

        var html = document.documentElement
        var body = document.body
        
        // When isMobile function be called，it will inject appropriate value
        var designWidth 

        
        function extend(target, src) {
            for (var key in src) {
                target[key] = src[key]
            }
            return target
        }

        function isMobile () {
            if (window.innerWidth < 768) {
                designWidth = mergeSettings.moblieDesignWidth === 'none' 
                  ? mergeSettings.PCDesignWidth : mergeSettings.moblieDesignWidth
                return true
            } else {
                designWidth = mergeSettings.PCDesignWidth === 'none'
                  ? mergeSettings.moblieDesignWidth : mergeSettings.PCDesignWidth
                return false
            }
        }

        var getRelativeValue = function (mon, relMon) {
            var relSon = 1 * relMon / mon
            return relSon
        }

        var getFixedClientWidth = function () {
            var width = Math.max(html.clientWidth, body.clientWidth)
            //In the PC, the clientWidth exclude scrollBar width, 
            //so add a scroll bar width to same as designWidth
            return isMobile() ? width : width + 17
        }

        var htmlNativeStyle = html.style

        var setHtmlFontSzieStr = function (clientWidth) {
            var res = htmlNativeStyle.fontSize = getRelativeValue(designWidth, clientWidth) + 'px'
            return res
        }

        var defRactPro = function (obj, key, value, cb) {
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                    return value
                },
                set: function (newValue) {
                    value = cb && cb(newValue) || newValue;
                }
            })
        }

        var proxy = {}

        defRactPro(proxy, 'resize', proxy['resize'], setHtmlFontSzieStr)

        proxy.resize = getFixedClientWidth()

        window.addEventListener('resize', function () {
            proxy.resize = getFixedClientWidth()
        })
    }

    return cssReactiveByRem
})