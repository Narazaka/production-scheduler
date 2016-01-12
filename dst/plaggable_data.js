if(typeof exports === 'undefined' && typeof window !== 'undefined') var exports = window;
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlaggableDataList = function () {
  function PlaggableDataList(fields) {
    var _this = this;

    var events = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    _classCallCheck(this, PlaggableDataList);

    this._fields = fields;
    this.fields.forEach(function (field) {
      return field.setup_collection(_this);
    });
    this.events = events;
  }

  _createClass(PlaggableDataList, [{
    key: 'add_event',
    value: function add_event(pdata) {
      var ev = pdata instanceof PlaggableData ? pdata : new PlaggableData(this.fields, pdata);
      this.events.push(ev);
    }
  }, {
    key: 'fields',
    get: function get() {
      return this._fields;
    }
  }, {
    key: 'events',
    set: function set(events) {
      var _this2 = this;

      this._events = [];
      events.forEach(function (pdata) {
        return _this2.add_event(pdata);
      });
    },
    get: function get() {
      return this._events;
    }
  }]);

  return PlaggableDataList;
}();

var PlaggableData = function () {
  function PlaggableData(fields, data_obj) {
    var fill_fields = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, PlaggableData);

    this.__fields = fields instanceof PlaggableDataField.FieldSet ? fields : new PlaggableDataField.FieldSet('', null, fields instanceof Array ? fields : [fields]);
    this.__setup();
    if (data_obj) {
      if (fill_fields) {
        this._reset_data(data_obj);
      } else {
        this._set_data(data_obj);
      }
    }
  }

  _createClass(PlaggableData, [{
    key: '__setup',
    value: function __setup() {
      this.__fields.setup_member(this);
    }
  }, {
    key: '_reset_data',
    value: function _reset_data(data_obj) {
      this._fields.reset_data(this, data_obj);
    }
  }, {
    key: '_set_data',
    value: function _set_data(data_obj) {
      this._fields.set_data(this, data_obj);
    }
  }, {
    key: '_get_data',
    value: function _get_data() {
      var data_obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this._fields.get_data(this, data_obj);
    }
  }, {
    key: 'valueOf',
    value: function valueOf() {
      return this._get_data();
    }
  }, {
    key: '_fields',
    get: function get() {
      return this.__fields;
    }
  }]);

  return PlaggableData;
}();

var PlaggableDataWithHistory = function (_PlaggableData) {
  _inherits(PlaggableDataWithHistory, _PlaggableData);

  function PlaggableDataWithHistory(fields, data_obj) {
    var fill_fields = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, PlaggableDataWithHistory);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(PlaggableDataWithHistory).call(this, fields, data_obj, fill_fields));

    _this3.__history = [];
    return _this3;
  }

  _createClass(PlaggableDataWithHistory, [{
    key: '_save',
    value: function _save() {
      var revision = arguments.length <= 0 || arguments[0] === undefined ? new Date() : arguments[0];

      this.history.push(new PlaggableData(this._fields, this.valueOf()));
    }
  }, {
    key: '_history',
    get: function get() {
      return this.__history;
    }
  }]);

  return PlaggableDataWithHistory;
}(PlaggableData);

var PlaggableDataField = function () {
  function PlaggableDataField(name, title) {
    _classCallCheck(this, PlaggableDataField);

    if (name == null) throw new Error('name must not be null');
    this._name = name;
    this._title = title != null ? title : name;
  }

  _createClass(PlaggableDataField, [{
    key: 'name',
    get: function get() {
      return this._name;
    }
  }, {
    key: 'title',
    get: function get() {
      return this._title;
    }
  }]);

  return PlaggableDataField;
}();

PlaggableDataField.Value = function (_PlaggableDataField) {
  _inherits(Value, _PlaggableDataField);

  function Value(name, title) {
    var nullable = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    _classCallCheck(this, Value);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Value).call(this, name, title));

    _this4.property_getter = _this4.property_getter.bind(_this4);
    _this4.property_setter = _this4.property_setter.bind(_this4);
    _this4._field_name = '_' + _this4.name;
    _this4._nullable = nullable;
    return _this4;
  }

  _createClass(Value, [{
    key: 'reset_data',
    value: function reset_data(pdata, data_obj) {
      if (data_obj && data_obj[this.name]) {
        pdata[this.name] = data_obj[this.name];
      } else {
        pdata[this.name] = null;
      }
    }
  }, {
    key: 'set_data',
    value: function set_data(pdata, data_obj) {
      if (data_obj && data_obj[this.name]) {
        pdata[this.name] = data_obj[this.name];
      }
    }
  }, {
    key: 'get_data',
    value: function get_data(pdata) {
      var data_obj = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      data_obj[this.name] = pdata[this.name];
      return data_obj;
    }
  }, {
    key: 'setup_collection',
    value: function setup_collection(events) {
      var _this5 = this;

      var search_method = 'search_' + this.name;
      events[search_method] = function (value) {
        return events.events.filter(function (pdata) {
          return pdata[_this5.name] === value;
        });
      };
      var search_oneof_method = 'search_' + this.name + '_oneof';
      events[search_oneof_method] = function (values) {
        return events.events.filter(function (pdata) {
          return values.indexOf(pdata[_this5.name]) !== -1;
        });
      };
    }
  }, {
    key: 'setup_member',
    value: function setup_member(pdata) {
      var property_getter = this.property_getter;
      var property_setter = this.property_setter;
      Object.defineProperty(pdata, this.name, {
        enumerable: true,
        configurable: true,
        get: function get() {
          return property_getter(this);
        },
        set: function set(value) {
          return property_setter(this, value);
        }
      });
      Object.defineProperty(pdata, this._field_name, {
        enumerable: false,
        writable: true,
        configurable: true
      });
    }
  }, {
    key: 'unset_member',
    value: function unset_member(pdata) {
      delete pdata[this.name];
      // delete pdata[this._field_name];
    }
  }, {
    key: 'property_getter',
    value: function property_getter(pdata) {
      return pdata[this._field_name];
    }
  }, {
    key: 'property_setter',
    value: function property_setter(pdata) {
      var value = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (!this.nullable && value == null) throw new Error('value must not be null [' + value + ']');
      pdata[this._field_name] = value;
    }
  }, {
    key: 'nullable',
    get: function get() {
      return this._nullable;
    }
  }]);

  return Value;
}(PlaggableDataField);

PlaggableDataField.ChoiceValue = function (_PlaggableDataField$V) {
  _inherits(ChoiceValue, _PlaggableDataField$V);

  function ChoiceValue(name, title, choices) {
    var labels = arguments.length <= 3 || arguments[3] === undefined ? choices : arguments[3];
    var nullable = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];

    _classCallCheck(this, ChoiceValue);

    var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(ChoiceValue).call(this, name, title, nullable));

    _this6.label_property_getter = _this6.label_property_getter.bind(_this6);
    _this6.label_property_setter = _this6.label_property_setter.bind(_this6);
    _this6._label_field_name = _this6.name + '_label';
    _this6._choices = choices;
    _this6._labels = labels;
    _this6._choice_to_label_index = {};
    _this6._label_to_choice_index = {};
    _this6.choices.forEach(function (choice, index) {
      var label = _this6.labels[index];
      _this6._choice_to_label_index[choice] = label;
      if (label != null) _this6._label_to_choice_index[label] = choice;
    });
    return _this6;
  }

  _createClass(ChoiceValue, [{
    key: 'has_choice',
    value: function has_choice(choice) {
      return choice in this._choice_to_label_index;
    }
  }, {
    key: 'should_have_choice',
    value: function should_have_choice(choice) {
      if (!this.has_choice(choice)) {
        var choices_str = this.choices.join(', ');
        throw new Error('value must be one of ' + choices_str + ' [' + choice + ']');
      }
      return true;
    }
  }, {
    key: 'has_label',
    value: function has_label(label) {
      return label in this._label_to_choice_index;
    }
  }, {
    key: 'should_have_label',
    value: function should_have_label(label) {
      if (!this.has_label(label)) {
        var labels_str = this.labels.join(', ');
        throw new Error('value must be one of ' + labels_str + ' [' + label + ']');
      }
      return true;
    }
  }, {
    key: 'choice_of',
    value: function choice_of(label) {
      this.should_have_label(label);
      return this._label_to_choice_index[label];
    }
  }, {
    key: 'label_of',
    value: function label_of(choice) {
      this.should_have_choice(choice);
      var label = this._choice_to_label_index[choice];
      if (label == null) throw new Error('label of [' + choice + '] is undefined');
      return label;
    }
  }, {
    key: 'setup_member',
    value: function setup_member(pdata) {
      _get(Object.getPrototypeOf(ChoiceValue.prototype), 'setup_member', this).call(this, pdata);
      var label_property_getter = this.label_property_getter;
      var label_property_setter = this.label_property_setter;
      Object.defineProperty(pdata, this.label_field_name, {
        enumerable: false, // label will not serialized
        configurable: true,
        get: function get() {
          return label_property_getter(this);
        },
        set: function set(label) {
          return label_property_setter(this, label);
        }
      });
    }
  }, {
    key: 'unset_member',
    value: function unset_member(pdata) {
      _get(Object.getPrototypeOf(ChoiceValue.prototype), 'unset_member', this).call(this, pdata);
      delete pdata[this.label_field_name];
    }
  }, {
    key: 'property_setter',
    value: function property_setter(pdata, value) {
      if (value != null) this.should_have_choice(value);
      _get(Object.getPrototypeOf(ChoiceValue.prototype), 'property_setter', this).call(this, pdata, value);
    }
  }, {
    key: 'label_property_getter',
    value: function label_property_getter(pdata) {
      return this.label_of(pdata[this.name]);
    }
  }, {
    key: 'label_property_setter',
    value: function label_property_setter(pdata, label) {
      if (label == null) {
        pdata[this.name] = null;
      } else {
        pdata[this.name] = this.choice_of(label);
      }
    }
  }, {
    key: 'label_field_name',
    get: function get() {
      return this._label_field_name;
    }
  }, {
    key: 'choices',
    get: function get() {
      return this._choices;
    }
  }, {
    key: 'labels',
    get: function get() {
      return this._labels;
    }
  }]);

  return ChoiceValue;
}(PlaggableDataField.Value);

PlaggableDataField.NumberValue = function (_PlaggableDataField$V2) {
  _inherits(NumberValue, _PlaggableDataField$V2);

  function NumberValue(name, title) {
    var nullable = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    _classCallCheck(this, NumberValue);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(NumberValue).call(this, name, title, nullable));
  }

  _createClass(NumberValue, [{
    key: 'setup_collection',
    value: function setup_collection(events) {
      var _this8 = this;

      var search_method = 'search_' + this.name;
      events[search_method] = function (value) {
        return events.events.filter(function (pdata) {
          return pdata[_this8.name] - value === 0;
        });
      };
      var search_oneof_method = 'search_' + this.name + '_oneof';
      events[search_oneof_method] = function (values) {
        return events.events.filter(function (pdata) {
          return values.some(function (value) {
            return pdata[_this8.name] - value === 0;
          });
        });
      };
      var search_in_method = 'search_' + this.name + '_in';
      events[search_in_method] = function (min, max) {
        return events.events.filter(function (pdata) {
          return min <= pdata[_this8.name] && pdata[_this8.name] <= max;
        });
      };
    }
  }, {
    key: 'property_setter',
    value: function property_setter(pdata, value) {
      if (value == null) {
        _get(Object.getPrototypeOf(NumberValue.prototype), 'property_setter', this).call(this, pdata, value);
      } else if (isNaN(value)) {
        throw new Error('value must be number [' + value + ']');
      } else {
        _get(Object.getPrototypeOf(NumberValue.prototype), 'property_setter', this).call(this, pdata, Number(value));
      }
    }
  }]);

  return NumberValue;
}(PlaggableDataField.Value);

PlaggableDataField.TimePoint = function (_PlaggableDataField$N) {
  _inherits(TimePoint, _PlaggableDataField$N);

  function TimePoint() {
    _classCallCheck(this, TimePoint);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TimePoint).apply(this, arguments));
  }

  _createClass(TimePoint, [{
    key: 'property_setter',
    value: function property_setter(pdata, value) {
      if (value == null) {
        _get(Object.getPrototypeOf(TimePoint.prototype), 'property_setter', this).call(this, pdata, value);
      } else {
        var date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error('value must be datelike [' + value + ']');
        }
        _get(Object.getPrototypeOf(TimePoint.prototype), 'property_setter', this).call(this, pdata, date);
      }
    }
  }]);

  return TimePoint;
}(PlaggableDataField.NumberValue);

PlaggableDataField.RelativeTimePoint = function (_PlaggableDataField$N2) {
  _inherits(RelativeTimePoint, _PlaggableDataField$N2);

  function RelativeTimePoint(name, title, reference_time_point) {
    var nullable = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

    _classCallCheck(this, RelativeTimePoint);

    var _this10 = _possibleConstructorReturn(this, Object.getPrototypeOf(RelativeTimePoint).call(this, name, title, nullable));

    if (reference_time_point == null) throw new Error('reference_time_point must not be null');
    _this10._reference_time_point = reference_time_point;
    _this10._setup_hook();
    return _this10;
  }

  _createClass(RelativeTimePoint, [{
    key: '_setup_hook',
    value: function _setup_hook() {
      var _this11 = this;

      this.reference_time_point.property_setter = function (pdata, value) {
        var old_value = pdata[_this11.reference_time_point.name];
        _this11.reference_time_point.property_setter(pdata, value);
        var new_value = pdata[_this11.reference_time_point.name];
        _this11._on_reference_time_point_changed(pdata, old_value, new_value);
      };
    }
  }, {
    key: '_on_reference_time_point_changed',
    value: function _on_reference_time_point_changed(pdata, old_value, new_value) {
      if (old_value != null || new_value != null) {
        if (old_value == null) {
          // null -> date
          pdata[this.name] = pdata[this.name];
        } else if (new_value == null) {
          // date -> null
          var value = _get(Object.getPrototypeOf(RelativeTimePoint.prototype), 'property_getter', this).call(this, pdata);
          pdata[this.name] = new Date(old_value.getTime() + value);
        }
      }
    }
  }, {
    key: 'property_getter',
    value: function property_getter(pdata) {
      var value = _get(Object.getPrototypeOf(RelativeTimePoint.prototype), 'property_getter', this).call(this, pdata);
      if (value == null || value instanceof Date) {
        return value;
      } else {
        return new Date(pdata[this.reference_time_point.name].getTime() + value);
      }
    }
  }, {
    key: 'property_setter',
    value: function property_setter(pdata, value) {
      if (value == null || typeof value === 'number' || value instanceof Number) {
        if (pdata[this.reference_time_point.name] == null) throw new Error('cannot set number when reference date is null');
        _get(Object.getPrototypeOf(RelativeTimePoint.prototype), 'property_setter', this).call(this, pdata, value);
      } else {
        var date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error('value must be offset integer or datelike [' + value + ']');
        }
        var reference_date = pdata[this.reference_time_point.name];
        _get(Object.getPrototypeOf(RelativeTimePoint.prototype), 'property_setter', this).call(this, pdata, reference_date ? date - reference_date : date);
      }
    }
  }, {
    key: 'reference_time_point',
    get: function get() {
      return this._reference_time_point;
    }
  }]);

  return RelativeTimePoint;
}(PlaggableDataField.NumberValue);

PlaggableDataField.FieldSet = function (_PlaggableDataField2) {
  _inherits(FieldSet, _PlaggableDataField2);

  function FieldSet(name, title, fields) {
    _classCallCheck(this, FieldSet);

    var _this12 = _possibleConstructorReturn(this, Object.getPrototypeOf(FieldSet).call(this, name, title));

    _this12._fields = fields;
    return _this12;
  }

  _createClass(FieldSet, [{
    key: 'fields_recursive',
    value: function fields_recursive() {
      var fields = [];
      this.fields.forEach(function (field) {
        fields.push(field);
        if (field.fields_recursive) {
          field.fields_recursive().forEach(function (_field) {
            return fields.push(_field);
          });
        }
      });
      return fields;
    }
  }, {
    key: 'reset_data',
    value: function reset_data(pdata, data_obj) {
      this.fields.forEach(function (field) {
        return field.reset_data(pdata, data_obj);
      });
    }
  }, {
    key: 'set_data',
    value: function set_data(pdata, data_obj) {
      this.fields.forEach(function (field) {
        return field.set_data(pdata, data_obj);
      });
    }
  }, {
    key: 'get_data',
    value: function get_data(pdata) {
      var data_obj = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      this.fields.forEach(function (field) {
        return field.get_data(pdata, data_obj);
      });
      return data_obj;
    }
  }, {
    key: 'setup_collection',
    value: function setup_collection(events) {
      this.fields.forEach(function (field) {
        return field.setup_collection(events);
      });
    }
  }, {
    key: 'setup_member',
    value: function setup_member(pdata) {
      this.fields.forEach(function (field) {
        return field.setup_member(pdata);
      });
    }
  }, {
    key: 'unset_member',
    value: function unset_member(pdata) {
      this.fields.forEach(function (field) {
        return field.unset_member(pdata);
      });
    }
  }, {
    key: 'fields',
    get: function get() {
      return this._fields;
    }
  }]);

  return FieldSet;
}(PlaggableDataField);

PlaggableDataField.Type = function (_PlaggableDataField$C) {
  _inherits(Type, _PlaggableDataField$C);

  function Type(name, title, field_sets) {
    var nullable = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

    _classCallCheck(this, Type);

    var choices = field_sets.map(function (field_set) {
      return field_set.name;
    });
    var labels = field_sets.map(function (field_set) {
      return field_set.title;
    });

    var _this13 = _possibleConstructorReturn(this, Object.getPrototypeOf(Type).call(this, name, title, choices, labels, nullable));

    _this13._field_sets = field_sets;
    return _this13;
  }

  _createClass(Type, [{
    key: 'field_set',
    value: function field_set(name) {
      return this.field_sets.find(function (field_set) {
        return field_set.name === name;
      });
    }
  }, {
    key: 'property_setter',
    value: function property_setter(pdata, value) {
      var old_value = pdata[this.name];
      _get(Object.getPrototypeOf(Type.prototype), 'property_setter', this).call(this, pdata, value);
      if (old_value !== value) {
        this._swap_field_set(pdata, old_value, value);
      }
    }
  }, {
    key: '_swap_field_set',
    value: function _swap_field_set(pdata, previous, next) {
      var previous_field_set = this.field_set(previous);
      var next_field_set = this.field_set(next);
      var data_obj = undefined;
      if (previous_field_set) {
        data_obj = previous_field_set.get_data(pdata);
        previous_field_set.unset_member(pdata);
      }
      if (next_field_set) {
        next_field_set.setup_member(pdata);
        if (data_obj) {
          next_field_set.set_data(pdata, data_obj);
        }
      }
    }
  }, {
    key: 'field_sets',
    get: function get() {
      return this._field_sets;
    }
  }]);

  return Type;
}(PlaggableDataField.ChoiceValue);

exports.PlaggableDataList = PlaggableDataList;
exports.PlaggableData = PlaggableData;
exports.PlaggableDataWithHistory = PlaggableDataWithHistory;
exports.PlaggableDataField = PlaggableDataField;