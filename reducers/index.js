import { combineReducers } from 'redux';
import { ownInfo } from './ownInfo';
import { alermList } from './alermList';

export const reducers = combineReducers({
  alermList: alermList,
  ownInfo: ownInfo,
});
