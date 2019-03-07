import * as DEF from '../constants/constants';

export const setName = name => ({
  type: DEF.ALERM_LIST.ADD,
  name: name,
});

export const deleteName = () => ({
  type: DEF.ALERM_LIST.DELETE,
  name: '',
});
