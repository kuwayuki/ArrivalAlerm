import { combineReducers } from 'redux';
import { ownInfo } from './ownInfo';
import { alermList } from './alermList';

export const reducers = combineReducers({
  ownInfo: ownInfo,
  alermList: alermList,
});
