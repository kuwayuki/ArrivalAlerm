import React from 'react';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  StoreReview,
} from 'expo';
import { Alert } from 'react-native';
import { LANGUAGE } from '../constants/language';
import * as json from './jsonFile';

export const BANNER = 'ca-app-pub-2103807205659646/2958032499';
const INTERSTITIAL = 'ca-app-pub-2103807205659646/1954946162';
const MAX_NUM = 5;
export const random = () => {
  return Math.floor(Math.random() * Math.floor(MAX_NUM));
};

export const admobBanner = () => {
  return <AdMobBanner bannerSize="smartBannerPortrait" adUnitID={BANNER} />;
};

export async function admobInterstitial() {
  let randomNum = random();
  if (randomNum == 0) {
    AdMobInterstitial.setAdUnitID(INTERSTITIAL);
    await AdMobInterstitial.requestAdAsync();
    await AdMobInterstitial.showAdAsync();
  }
}

export const storeReview = props => {
  if (props.ownInfo.reviewed) return;
  if (StoreReview.isSupported()) {
    Alert.alert(LANGUAGE.wd.reviewTitle, LANGUAGE.wd.reviewQuestion, [
      {
        text: 'OK',
        onPress: async () => {
          await StoreReview.requestReview();
          props.setOwnInfoReviewed(true);
          await json.mergeStorageDataOwnInfo({ reviewed: true });
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  }
};
