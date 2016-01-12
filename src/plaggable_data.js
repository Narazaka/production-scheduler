class PlaggableDataList {
  constructor(fields, data_objs = []) {
    this._fields = fields;
    this.fields.forEach(
      (field) => field.setup_collection(this)
    );
    this.data_list = data_objs;
  }

  get fields() {
    return this._fields;
  }

  set data_list(data_list) {
    this._data_list = [];
    data_list.forEach((data) => this.add(data));
  }

  get data_list() {
    return this._data_list;
  }

  add(data) {
    const pdata = data instanceof PlaggableDataWithHistory ? data : new PlaggableDataWithHistory(this.fields, data);
    this.data_list.push(pdata);
  }
}

class PlaggableData {
  constructor(fields, data_obj, fill_fields = false) {
    this.__fields = fields instanceof PlaggableDataField.FieldSet
      ? fields
      : new PlaggableDataField.FieldSet('', null,
        fields instanceof Array ? fields : [fields]);
    this.__setup();
    if (data_obj) {
      if (fill_fields) {
        this._reset_data(data_obj);
      } else {
        this._set_data(data_obj);
      }
    }
  }

  get _fields() {
    return this.__fields;
  }

  __setup() {
    this.__fields.setup_member(this)
  }

  _reset_data(data_obj) {
    this._fields.reset_data(this, data_obj);
  }

  _set_data(data_obj) {
    this._fields.set_data(this, data_obj);
  }

  _get_data(data_obj = {}) {
    return this._fields.get_data(this, data_obj);
  }

  valueOf() {
    return this._get_data();
  }
}

class PlaggableDataWithHistory extends PlaggableData {
  constructor(fields, data_obj, fill_fields = false) {
    super(fields, data_obj, fill_fields);
    this.__history = [];
  }

  get _history() {
    return this.__history;
  }

  _save(revision = new Date()) {
    this._history.push(new PlaggableData(this._fields, this.valueOf()));
  }
}

class PlaggableDataField {
  constructor(name, title) {
    if (name == null) throw new Error('name must not be null');
    this._name = name;
    this._title = title != null ? title : name;
  }

  get name() {
    return this._name;
  }

  get title() {
    return this._title;
  }
}

PlaggableDataField.Value = class Value extends PlaggableDataField {
  constructor(name, title, nullable = true) {
    super(name, title);
    this.property_getter = this.property_getter.bind(this);
    this.property_setter = this.property_setter.bind(this);
    this._field_name = `_${this.name}`;
    this._nullable = nullable;
  }

  get nullable() {
    return this._nullable;
  }

  reset_data(pdata, data_obj) {
    if (data_obj && data_obj[this.name]) {
      pdata[this.name] = data_obj[this.name];
    } else {
      pdata[this.name] = null;
    }
  }

  set_data(pdata, data_obj) {
    if (data_obj && data_obj[this.name]) {
      pdata[this.name] = data_obj[this.name];
    }
  }

  get_data(pdata, data_obj = {}) {
    data_obj[this.name] = pdata[this.name];
    return data_obj;
  }

  setup_collection(pdata_list) {
    const search_method = `search_${this.name}`;
    pdata_list[search_method] = (value) =>
      pdata_list.pdata_list.filter(
        (pdata) => pdata[this.name] === value
      )
    const search_oneof_method = `search_${this.name}_oneof`;
    pdata_list[search_oneof_method] = (values) =>
      pdata_list.pdata_list.filter(
        (pdata) => values.indexOf(pdata[this.name]) !== -1
      )
  }

  setup_member(pdata) {
    const property_getter = this.property_getter;
    const property_setter = this.property_setter;
    Object.defineProperty(pdata, this.name, {
      enumerable: true,
      configurable: true,
      get: function() { return property_getter(this); },
      set: function(value) { return property_setter(this, value); },
    });
    Object.defineProperty(pdata, this._field_name, {
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }

  unset_member(pdata) {
    delete pdata[this.name];
    // delete pdata[this._field_name];
  }

  property_getter(pdata) {
    return pdata[this._field_name];
  }

  property_setter(pdata, value = null) {
    if (!this.nullable && value == null)
      throw new Error(`value must not be null [${value}]`);
    pdata[this._field_name] = value;
  }
}

PlaggableDataField.ChoiceValue = class ChoiceValue extends PlaggableDataField.Value {
  constructor(name, title, choices, labels = choices, nullable = true) {
    super(name, title, nullable);
    this.label_property_getter = this.label_property_getter.bind(this);
    this.label_property_setter = this.label_property_setter.bind(this);
    this._label_field_name = `${this.name}_label`;
    this._choices = choices;
    this._labels = labels;
    this._choice_to_label_index = {};
    this._label_to_choice_index = {};
    this.choices.forEach(
      (choice, index) => {
        const label = this.labels[index];
        this._choice_to_label_index[choice] = label;
        if (label != null) this._label_to_choice_index[label] = choice;
      }
    );
  }

  get label_field_name() {
    return this._label_field_name;
  }

  get choices() {
    return this._choices;
  }

  get labels() {
    return this._labels;
  }

  has_choice(choice) {
    return choice in this._choice_to_label_index;
  }

  should_have_choice(choice) {
    if (!this.has_choice(choice)) {
      const choices_str = this.choices.join(', ');
      throw new Error(`value must be one of ${choices_str} [${choice}]`);
    }
    return true;
  }

  has_label(label) {
    return label in this._label_to_choice_index;
  }

  should_have_label(label) {
    if (!this.has_label(label)) {
      const labels_str = this.labels.join(', ');
      throw new Error(`value must be one of ${labels_str} [${label}]`);
    }
    return true;
  }

  choice_of(label) {
    this.should_have_label(label);
    return this._label_to_choice_index[label];
  }

  label_of(choice) {
    this.should_have_choice(choice);
    const label = this._choice_to_label_index[choice];
    if (label == null) throw new Error(`label of [${choice}] is undefined`);
    return label;
  }

  setup_member(pdata) {
    super.setup_member(pdata);
    const label_property_getter = this.label_property_getter;
    const label_property_setter = this.label_property_setter;
    Object.defineProperty(pdata, this.label_field_name, {
      enumerable: false, // label will not serialized
      configurable: true,
      get: function() { return label_property_getter(this); },
      set: function(label) { return label_property_setter(this, label); },
    });
  }

  unset_member(pdata) {
    super.unset_member(pdata);
    delete pdata[this.label_field_name];
  }

  property_setter(pdata, value) {
    if (value != null) this.should_have_choice(value);
    super.property_setter(pdata, value);
  }

  label_property_getter(pdata) {
    return this.label_of(pdata[this.name]);
  }

  label_property_setter(pdata, label) {
    if (label == null) {
      pdata[this.name] = null;
    } else {
      pdata[this.name] = this.choice_of(label);
    }
  }
}

PlaggableDataField.NumberValue = class NumberValue extends PlaggableDataField.Value {
  constructor(name, title, nullable = true) {
    super(name, title, nullable);
  }

  setup_collection(pdata_list) {
    const search_method = `search_${this.name}`;
    pdata_list[search_method] = (value) =>
      pdata_list.pdata_list.filter(
        (pdata) => (pdata[this.name] - value) === 0
      )
    const search_oneof_method = `search_${this.name}_oneof`;
    pdata_list[search_oneof_method] = (values) =>
      pdata_list.pdata_list.filter(
        (pdata) => values.some((value) => (pdata[this.name] - value) === 0)
      )
    const search_in_method = `search_${this.name}_in`;
    pdata_list[search_in_method] = (min, max) =>
      pdata_list.pdata_list.filter(
        (pdata) => min <= pdata[this.name] && pdata[this.name] <= max
      )
  }

  property_setter(pdata, value) {
    if (value == null) {
      super.property_setter(pdata, value);
    } else if (isNaN(value)) {
      throw new Error(`value must be number [${value}]`);
    } else {
      super.property_setter(pdata, Number(value));
    }
  }
}

PlaggableDataField.TimePoint = class TimePoint extends PlaggableDataField.NumberValue {
  property_setter(pdata, value) {
    if (value == null) {
      super.property_setter(pdata, value);
    } else {
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error(`value must be datelike [${value}]`);
      }
      PlaggableDataField.Value.prototype.property_setter.call(this, pdata, date);
    }
  }
}

PlaggableDataField.RelativeTimePoint
  = class RelativeTimePoint extends PlaggableDataField.NumberValue {
  constructor(name, title, reference_time_point, nullable = true) {
    super(name, title, nullable);
    if (reference_time_point == null)
      throw new Error('reference_time_point must not be null');
    this._reference_time_point = reference_time_point;
    this._setup_hook();
  }

  get reference_time_point() {
    return this._reference_time_point;
  }

  _setup_hook() {
    const reference_time_point_property_setter
      = this.reference_time_point.property_setter;
    this.reference_time_point.property_setter = (pdata, value) => {
      const old_value = pdata[this.reference_time_point.name];
      reference_time_point_property_setter(pdata, value);
      const new_value = pdata[this.reference_time_point.name];
      this._on_reference_time_point_changed(pdata, old_value, new_value);
    }
  }

  _on_reference_time_point_changed(pdata, old_value, new_value) {
    if (old_value != null || new_value != null) {
      if (old_value == null) { // null -> date
        pdata[this.name] = pdata[this.name];
      } else if (new_value == null) { // date -> null
        const value = super.property_getter(pdata);
        pdata[this.name] = new Date(old_value.getTime() + value);
      }
    }
  }

  property_getter(pdata) {
    const value = super.property_getter(pdata);
    if (value == null || value instanceof Date) {
      return value;
    } else {
      return new Date(pdata[this.reference_time_point.name].getTime() + value);
    }
  }

  property_setter(pdata, value) {
    if (value == null || typeof value === 'number' || value instanceof Number) {
      if (pdata[this.reference_time_point.name] == null)
        throw new Error('cannot set number when reference date is null');
      super.property_setter(pdata, value);
    } else {
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error(`value must be offset integer or datelike [${value}]`);
      }
      const reference_date = pdata[this.reference_time_point.name];
      PlaggableDataField.Value.prototype.property_setter.call(this, pdata, reference_date ? date - reference_date : date);
    }
  }
}

PlaggableDataField.FieldSet = class FieldSet extends PlaggableDataField {
  constructor(name, title, fields) {
    super(name, title);
    this._fields = fields;
  }

  get fields() {
    return this._fields;
  }

  fields_recursive() {
    const fields = [];
    this.fields.forEach(
      (field) => {
        fields.push(field);
        if (field.fields_recursive) {
          field.fields_recursive().forEach(
            (_field) => fields.push(_field)
          );
        }
      }
    );
    return fields;
  }

  reset_data(pdata, data_obj) {
    this.fields.forEach(
      (field) => field.reset_data(pdata, data_obj)
    );
  }

  set_data(pdata, data_obj) {
    this.fields.forEach(
      (field) => field.set_data(pdata, data_obj)
    );
  }

  get_data(pdata, data_obj = {}) {
    this.fields.forEach(
      (field) => field.get_data(pdata, data_obj)
    );
    return data_obj;
  }

  setup_collection(pdata_list) {
    this.fields.forEach(
      (field) => field.setup_collection(pdata_list)
    );
  }

  setup_member(pdata) {
    this.fields.forEach(
      (field) => field.setup_member(pdata)
    );
  }

  unset_member(pdata) {
    this.fields.forEach(
      (field) => field.unset_member(pdata)
    );
  }
}

PlaggableDataField.Type = class Type extends PlaggableDataField.ChoiceValue {
  constructor(name, title, field_sets, nullable = true) {
    const choices = field_sets.map((field_set) => field_set.name);
    const labels = field_sets.map((field_set) => field_set.title);
    super(name, title, choices, labels, nullable);
    this._field_sets = field_sets;
  }

  get field_sets() {
    return this._field_sets;
  }

  field_set(name) {
    return this.field_sets.find(
      (field_set) => field_set.name === name
    );
  }

  reset_data(pdata, data_obj) {
    super.reset_data(pdata, data_obj);
    const field_set = this.field_set(pdata[this.name]);
    if (field_set) field_set.reset_data(pdata, data_obj);
  }

  set_data(pdata, data_obj) {
    super.set_data(pdata, data_obj);
    const field_set = this.field_set(pdata[this.name]);
    if (field_set) field_set.set_data(pdata, data_obj);
  }

  get_data(pdata, data_obj = {}) {
    super.get_data(pdata, data_obj);
    const field_set = this.field_set(pdata[this.name]);
    if (field_set) field_set.get_data(pdata, data_obj);
    return data_obj;
  }

  setup_collection(pdata_list) {
    super.setup_collection(pdata_list);
    this.field_sets.forEach(
      (field_set) => field_set.setup_collection(pdata_list)
    );
  }

  setup_member(pdata) {
    super.setup_member(pdata);
    const field_set = this.field_set(pdata[this.name]);
    if (field_set) field_set.setup_member(pdata);
  }

  unset_member(pdata) {
    const field_set = this.field_set(pdata[this.name]);
    super.unset_member(pdata);
    if (field_set) field_set.unset_member(pdata);
  }

  property_setter(pdata, value) {
    const old_value = pdata[this.name];
    super.property_setter(pdata, value);
    if (old_value !== value) {
      this._swap_field_set(pdata, old_value, value);
    }
  }

  _swap_field_set(pdata, previous, next) {
    const previous_field_set = this.field_set(previous);
    const next_field_set = this.field_set(next);
    let data_obj;
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
}

export {PlaggableDataList, PlaggableData, PlaggableDataWithHistory, PlaggableDataField};
