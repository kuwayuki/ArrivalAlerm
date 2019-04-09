import React from 'react';
import { AdMobBanner, AdMobInterstitial, PublisherBanner } from 'expo';

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
