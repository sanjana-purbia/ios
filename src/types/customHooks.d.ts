import {AppStateStatus} from 'react-native';

export type AppStateObj = {
  current: AppStateStatus;
  previous: AppStateStatus | null;
};
