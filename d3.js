(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-transition'), require('d3-drag'), require('d3-selection'), require('d3-dispatch'), require('d3-collection'), require('d3-array'), require('d3-fetch'), require('d3-shape'), require('d3-scale'), require('d3-axis'), require('d3-request'), require('d3-force'), require('d3-ease'), require('d3-format'), require('d3-time-format')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-transition', 'd3-drag', 'd3-selection', 'd3-dispatch', 'd3-collection', 'd3-array', 'd3-fetch', 'd3-shape', 'd3-scale', 'd3-axis', 'd3-request', 'd3-force', 'd3-ease', 'd3-format', 'd3-time-format'], factory) :
    (global = global || self, factory(global.d3 = {}, null, null, global.d3Selection, global.d3Dispatch, global.d3Collection, global.d3Array, global.d3Fetch, global.d3Shape, global.d3Scale, global.d3Axis, global.d3Request, global.d3Force, global.d3Ease, global.d3Format, global.d3TimeFormat));
}(this, function (exports, d3Transition, d3Drag, d3Selection, d3Dispatch, d3Collection, d3Array, d3Fetch, d3Shape, d3Scale, d3Axis, d3Request, d3Force, d3Ease, d3Format, d3TimeFormat) { 'use strict';

    Object.defineProperty(exports, 'event', {
        enumerable: true,
        get: function () {
            return d3Selection.event;
        }
    });
    Object.defineProperty(exports, 'mouse', {
        enumerable: true,
        get: function () {
            return d3Selection.mouse;
        }
    });
    Object.defineProperty(exports, 'select', {
        enumerable: true,
        get: function () {
            return d3Selection.select;
        }
    });
    Object.defineProperty(exports, 'selectAll', {
        enumerable: true,
        get: function () {
            return d3Selection.selectAll;
        }
    });
    Object.defineProperty(exports, 'dispatch', {
        enumerable: true,
        get: function () {
            return d3Dispatch.dispatch;
        }
    });
    Object.defineProperty(exports, 'nest', {
        enumerable: true,
        get: function () {
            return d3Collection.nest;
        }
    });
    Object.defineProperty(exports, 'bisector', {
        enumerable: true,
        get: function () {
            return d3Array.bisector;
        }
    });
    Object.defineProperty(exports, 'group', {
        enumerable: true,
        get: function () {
            return d3Array.group;
        }
    });
    Object.defineProperty(exports, 'max', {
        enumerable: true,
        get: function () {
            return d3Array.max;
        }
    });
    Object.defineProperty(exports, 'min', {
        enumerable: true,
        get: function () {
            return d3Array.min;
        }
    });
    Object.defineProperty(exports, 'range', {
        enumerable: true,
        get: function () {
            return d3Array.range;
        }
    });
    Object.defineProperty(exports, 'json', {
        enumerable: true,
        get: function () {
            return d3Fetch.json;
        }
    });
    Object.defineProperty(exports, 'arc', {
        enumerable: true,
        get: function () {
            return d3Shape.arc;
        }
    });
    Object.defineProperty(exports, 'area', {
        enumerable: true,
        get: function () {
            return d3Shape.area;
        }
    });
    Object.defineProperty(exports, 'curveCardinal', {
        enumerable: true,
        get: function () {
            return d3Shape.curveCardinal;
        }
    });
    Object.defineProperty(exports, 'curveLinear', {
        enumerable: true,
        get: function () {
            return d3Shape.curveLinear;
        }
    });
    Object.defineProperty(exports, 'line', {
        enumerable: true,
        get: function () {
            return d3Shape.line;
        }
    });
    Object.defineProperty(exports, 'scaleBand', {
        enumerable: true,
        get: function () {
            return d3Scale.scaleBand;
        }
    });
    Object.defineProperty(exports, 'scaleLinear', {
        enumerable: true,
        get: function () {
            return d3Scale.scaleLinear;
        }
    });
    Object.defineProperty(exports, 'scaleOrdinal', {
        enumerable: true,
        get: function () {
            return d3Scale.scaleOrdinal;
        }
    });
    Object.defineProperty(exports, 'scaleTime', {
        enumerable: true,
        get: function () {
            return d3Scale.scaleTime;
        }
    });
    Object.defineProperty(exports, 'axisBottom', {
        enumerable: true,
        get: function () {
            return d3Axis.axisBottom;
        }
    });
    Object.defineProperty(exports, 'axisLeft', {
        enumerable: true,
        get: function () {
            return d3Axis.axisLeft;
        }
    });
    Object.defineProperty(exports, 'csv', {
        enumerable: true,
        get: function () {
            return d3Request.csv;
        }
    });
    Object.defineProperty(exports, 'forceCenter', {
        enumerable: true,
        get: function () {
            return d3Force.forceCenter;
        }
    });
    Object.defineProperty(exports, 'forceCollide', {
        enumerable: true,
        get: function () {
            return d3Force.forceCollide;
        }
    });
    Object.defineProperty(exports, 'forceManyBody', {
        enumerable: true,
        get: function () {
            return d3Force.forceManyBody;
        }
    });
    Object.defineProperty(exports, 'forceSimulation', {
        enumerable: true,
        get: function () {
            return d3Force.forceSimulation;
        }
    });
    Object.defineProperty(exports, 'forceX', {
        enumerable: true,
        get: function () {
            return d3Force.forceX;
        }
    });
    Object.defineProperty(exports, 'forceY', {
        enumerable: true,
        get: function () {
            return d3Force.forceY;
        }
    });
    Object.defineProperty(exports, 'easeLinear', {
        enumerable: true,
        get: function () {
            return d3Ease.easeLinear;
        }
    });
    Object.defineProperty(exports, 'format', {
        enumerable: true,
        get: function () {
            return d3Format.format;
        }
    });
    Object.defineProperty(exports, 'timeFormat', {
        enumerable: true,
        get: function () {
            return d3TimeFormat.timeFormat;
        }
    });

    Object.defineProperty(exports, '__esModule', { value: true });

}));
