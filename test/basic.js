'use strict';

if (typeof require !== 'undefined') {
  var assert = require('power-assert');
  const plaggable_data = require('../src/plaggable_data');
  var PlaggableDataList = plaggable_data.PlaggableDataList;
  var PlaggableData = plaggable_data.PlaggableData;
  var PlaggableDataWithHistory = plaggable_data.PlaggableDataWithHistory;
  var PlaggableDataField = plaggable_data.PlaggableDataField;
}

describe('PlaggableData', () => {
  it('can initialize', () => {
    const start_at = new PlaggableDataField.TimePoint('start_at', 'リリース');
    const end_at = new PlaggableDataField.RelativeTimePoint('end_at', '終了', start_at);
    const staging_at = new PlaggableDataField.RelativeTimePoint('staging_at', 'ステージング', start_at);
    const start_end_at = new PlaggableDataField.FieldSet('start_end_at', 'リリース開始終了', [start_at, end_at]);
    const staging_start_end_at = new PlaggableDataField.FieldSet('staging_start_end_at', null, [start_end_at, staging_at]);
    const name = new PlaggableDataField.Value('name', '名称');
    const myevent_type = new PlaggableDataField.ChoiceValue('myevent_type', 'event種別', ['A', 'B', 'C']);
    const campaign_type = new PlaggableDataField.ChoiceValue('campaign_type', 'campaign種別', ['超', 'SUGOI', 'MECCHA']);
    const get_item = new PlaggableDataField.Value('get_item', 'ITEM');
    const myevent = new PlaggableDataField.FieldSet('myevent', 'event', [staging_start_end_at, name, myevent_type, get_item]);
    const campaign = new PlaggableDataField.FieldSet('campaign', 'campaign', [staging_start_end_at, name, campaign_type]);
    const event_type = new PlaggableDataField.Type('event_type', '種別', [myevent, campaign]);
    const pd = new PlaggableDataWithHistory([event_type], {});
    assert(pd instanceof PlaggableDataWithHistory);
    pd.event_type_label = "campaign";
    assert(pd.event_type === 'campaign');
    pd.campaign_type_label = 'SUGOI';
    assert(pd.campaign_type === 'SUGOI');
    pd._save();
    pd.event_type_label = "event";
    assert(pd.event_type === 'myevent');
    assert(pd.event_type_label === 'event');
    assert(pd._history[0].campaign_type_label === 'SUGOI');
    pd.end_at = new Date('2015-12-03T14:00:00+09:00');
    pd.start_at = new Date('2015-12-01T14:00:00+09:00');
    pd.start_at = new Date('2015-12-11T14:00:00+09:00');
    assert(pd.end_at - new Date('2015-12-13T14:00:00+09:00') === 0);
    console.log(pd.valueOf());
    pd.start_at = null;
    assert(pd.end_at - new Date('2015-12-13T14:00:00+09:00') === 0);
  });
});
