import React, { Component } from 'react';
import PropTypes from 'prop-types';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var sizerStyle = {
	position: "absolute",
	top: 0,
	left: 0,
	wordWrap: "break-word",
	visibility: "hidden"
};

var INPUT_PROPS_BLACKLIST = ["extraWidth", "injectStyles", "inputClassName", "inputRef", "inputStyle", "minWidth", "onAutosize", "placeholderIsMinWidth"];

var cleanInputProps = function cleanInputProps(inputProps) {
	INPUT_PROPS_BLACKLIST.forEach(function (field) {
		return delete inputProps[field];
	});
	return inputProps;
};

var copyStyles = function copyStyles(styles, node) {
	node.style.fontSize = styles.fontSize;
	node.style.fontFamily = styles.fontFamily;
	node.style.fontWeight = styles.fontWeight;
	node.style.fontStyle = styles.fontStyle;
	node.style.letterSpacing = styles.letterSpacing;
	node.style.textTransform = styles.textTransform;
};

var isIE = typeof window !== "undefined" && window.navigator ? /MSIE |Trident\/|Edge\//.test(window.navigator.userAgent) : false;

var generateId = function generateId() {
	// we only need an auto-generated ID for stylesheet injection, which is only
	// used for IE. so if the browser is not IE, this should return undefined.
	return isIE ? "_" + Math.random().toString(36).substr(2, 12) : undefined;
};

var THREAD_HOLD = 10;

var AutosizeTextArea = function (_Component) {
	inherits(AutosizeTextArea, _Component);
	createClass(AutosizeTextArea, null, [{
		key: "getDerivedStateFromProps",
		value: function getDerivedStateFromProps(props, state) {
			var id = props.id;

			return id !== state.prevId ? { inputId: id || generateId(), prevId: id } : null;
		}
	}]);

	function AutosizeTextArea(props) {
		classCallCheck(this, AutosizeTextArea);

		var _this = possibleConstructorReturn(this, (AutosizeTextArea.__proto__ || Object.getPrototypeOf(AutosizeTextArea)).call(this, props));

		_this.updateTextAreaRows = function () {
			var _this$input = _this.input,
			    offsetHeight = _this$input.offsetHeight,
			    scrollHeight = _this$input.scrollHeight;


			if (offsetHeight < scrollHeight) {
				_this.setState(function (prev) {
					return { rows: prev.rows + 1 };
				});
			}

			if (_this.sizer.scrollHeight + THREAD_HOLD < offsetHeight && _this.state.rows > 1) {
				_this.setState(function (prev) {
					return { rows: prev.rows - 1 };
				});
			}
		};

		_this.pxToNumber = function (str) {
			var PIXEL_REGEX = /\dpx/;
			if (!PIXEL_REGEX.test(str)) return 0;

			return +str.replace("px", "");
		};

		_this.getParentWidth = function () {
			var parentSelector = _this.props.parentSelector;

			if (parentSelector) {
				var parent = _this.container.closest(parentSelector);
				if (parent) {
					_this.setState({ parentWidth: parent.clientWidth });

					var totalPadding = 0;
					var current = _this.input;
					while (true) {
						var style = window.getComputedStyle(current);
						totalPadding += _this.pxToNumber(style.paddingLeft) + _this.pxToNumber(style.paddingRight) + _this.pxToNumber(style.marginLeft) + _this.pxToNumber(style.marginRight);

						if (current.parentElement === parent || current.parentElement === null) {
							break;
						}

						current = current.parentElement;
					}
					console.log(totalPadding);
					_this.setState({ totalPadding: totalPadding });
				}
			}
		};

		_this.inputRef = function (el) {
			_this.input = el;
			if (typeof _this.props.inputRef === "function") {
				_this.props.inputRef(el);
			}
		};

		_this.placeHolderSizerRef = function (el) {
			_this.placeHolderSizer = el;
		};

		_this.sizerRef = function (el) {
			_this.sizer = el;
		};

		_this.containerRef = function (el) {
			_this.container = el;
		};

		if (!_this.props.parentSelector) {
			throw new Error("field `parentSelector` is required");
		}

		_this.state = {
			inputWidth: props.minWidth,
			inputId: props.id || generateId(),
			prevId: props.id,
			rows: 1,
			parentWidth: "auto",
			totalPadding: 0
		};
		return _this;
	}

	createClass(AutosizeTextArea, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.mounted = true;
			this.copyInputStyles();
			this.updateInputWidth();
			this.getParentWidth();
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate(prevProps, prevState) {
			if (prevState.inputWidth !== this.state.inputWidth) {
				if (typeof this.props.onAutosize === "function") {
					this.props.onAutosize(this.state.inputWidth);
				}
			}
			this.updateInputWidth();
			this.updateTextAreaRows();
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			this.mounted = false;
		}
	}, {
		key: "copyInputStyles",
		value: function copyInputStyles() {
			if (!this.mounted || !window.getComputedStyle) {
				return;
			}
			var inputStyles = this.input && window.getComputedStyle(this.input);
			if (!inputStyles) {
				return;
			}
			copyStyles(inputStyles, this.sizer);
			if (this.placeHolderSizer) {
				copyStyles(inputStyles, this.placeHolderSizer);
			}
		}
	}, {
		key: "updateInputWidth",
		value: function updateInputWidth() {
			if (!this.mounted || !this.sizer || typeof this.sizer.scrollWidth === "undefined") {
				return;
			}
			var newInputWidth = void 0;
			if (this.props.placeholder && (!this.props.value || this.props.value && this.props.placeholderIsMinWidth)) {
				newInputWidth = Math.max(this.sizer.scrollWidth, this.placeHolderSizer.scrollWidth) + 2;
			} else {
				newInputWidth = this.sizer.scrollWidth + 2;
			}
			// add extraWidth to the detected width. for number types, this defaults to 16 to allow for the stepper UI
			var extraWidth = this.props.type === "number" && this.props.extraWidth === undefined ? 16 : parseInt(this.props.extraWidth) || 0;
			newInputWidth += extraWidth;
			if (newInputWidth < this.props.minWidth) {
				newInputWidth = this.props.minWidth;
			}
			if (newInputWidth !== this.state.inputWidth) {
				this.setState({
					inputWidth: newInputWidth
				});
			}
		}
	}, {
		key: "getInput",
		value: function getInput() {
			return this.input;
		}
	}, {
		key: "focus",
		value: function focus() {
			this.input.focus();
		}
	}, {
		key: "blur",
		value: function blur() {
			this.input.blur();
		}
	}, {
		key: "select",
		value: function select() {
			this.input.select();
		}
	}, {
		key: "renderStyles",
		value: function renderStyles() {
			// this method injects styles to hide IE's clear indicator, which messes
			// with input size detection. the stylesheet is only injected when the
			// browser is IE, and can also be disabled by the `injectStyles` prop.
			var injectStyles = this.props.injectStyles;

			return isIE && injectStyles ? React.createElement("style", {
				dangerouslySetInnerHTML: {
					__html: "input#" + this.state.inputId + "::-ms-clear {display: none;}"
				}
			}) : null;
		}
	}, {
		key: "render",
		value: function render() {
			var sizerValue = [this.props.defaultValue, this.props.value, ""].reduce(function (previousValue, currentValue) {
				if (previousValue !== null && previousValue !== undefined) {
					return previousValue;
				}
				return currentValue;
			});

			var _props$siblingWidth = this.props.siblingWidth,
			    siblingWidth = _props$siblingWidth === undefined ? 0 : _props$siblingWidth;


			var maxWidth = this.state.parentWidth === "auto" ? "auto" : this.state.parentWidth - this.state.totalPadding - 2 - siblingWidth;

			var wrapperStyle = _extends({}, this.props.style, {
				maxWidth: maxWidth
			});
			if (!wrapperStyle.display) wrapperStyle.display = "inline-block";

			var inputStyle = _extends({
				boxSizing: "content-box",
				width: this.state.inputWidth + "px",
				maxWidth: maxWidth
			}, this.props.inputStyle);

			var _props = this.props,
			    parentQuery = _props.parentQuery,
			    inputProps = objectWithoutProperties(_props, ["parentQuery"]);

			cleanInputProps(inputProps);
			inputProps.className = this.props.inputClassName;
			inputProps.id = this.state.inputId;
			inputProps.style = inputStyle;

			return React.createElement(
				"div",
				{
					ref: this.containerRef,
					className: this.props.className,
					style: wrapperStyle
				},
				this.renderStyles(),
				React.createElement("textarea", _extends({}, inputProps, {
					style: _extends({}, inputProps.style, {
						resize: "none"
					}),
					rows: this.state.rows,
					ref: this.inputRef,
					onKeyPress: function onKeyPress(e) {
						if (e.key === "Enter") {
							e.preventDefault();
						}
					}
				})),
				React.createElement(
					"div",
					{ ref: this.sizerRef, style: _extends({}, sizerStyle, { maxWidth: maxWidth }) },
					sizerValue
				),
				this.props.placeholder ? React.createElement(
					"div",
					{ ref: this.placeHolderSizerRef, style: sizerStyle },
					this.props.placeholder
				) : null
			);
		}
	}]);
	return AutosizeTextArea;
}(Component);

AutosizeTextArea.propTypes = {
	className: PropTypes.string, // className for the outer element
	parentQuery: PropTypes.string,
	siblingWidth: PropTypes.number,
	defaultValue: PropTypes.any, // default field value
	extraWidth: PropTypes.oneOfType([
	// additional width for input element
	PropTypes.number, PropTypes.string]),
	id: PropTypes.string, // id to use for the input, can be set for consistent snapshots
	injectStyles: PropTypes.bool, // inject the custom stylesheet to hide clear UI, defaults to true
	inputClassName: PropTypes.string, // className for the input element
	inputRef: PropTypes.func, // ref callback for the input element
	inputStyle: PropTypes.object, // css styles for the input element
	minWidth: PropTypes.oneOfType([
	// minimum width for input element
	PropTypes.number, PropTypes.string]),
	onAutosize: PropTypes.func, // onAutosize handler: function(newWidth) {}
	onChange: PropTypes.func, // onChange handler: function(event) {}
	placeholder: PropTypes.string, // placeholder text
	placeholderIsMinWidth: PropTypes.bool, // don't collapse size to less than the placeholder
	style: PropTypes.object, // css styles for the outer element
	value: PropTypes.any // field value
};
AutosizeTextArea.defaultProps = {
	minWidth: 1,
	injectStyles: true
};

export default AutosizeTextArea;
