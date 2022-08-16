import {Canary as CanaryImage, rightArrowIcon} from '../../assets/common';
import {Anonymous, Discovery, Secure, Canary} from '../../assets/animation';
import {layoutPtToPx} from '../../utils/responsiveUI';

const LandingScreenCarousalData = [
  {
    id: 'welcome',
    imageAsset: CanaryImage,
    animationAsset: Canary,
    animationStyle: {
      height: layoutPtToPx(260),
      width: layoutPtToPx(260),
    },
    primaryText: 'Welcome to Canary',
    secondaryText:
      'A privacy-focused app which lets you browse content from Twitter without being tracked',
    buttonText: 'Tell me more',
  },
  {
    id: 'discover',
    animationAsset: Discovery,
    animationStyle: {
      height: layoutPtToPx(260),
      width: layoutPtToPx(260),
    },
    primaryText: 'Discover Content',
    secondaryText:
      'Personalize your home feed, search for topics, archive tweets, and create lists',
    buttonText: 'Sounds Pretty Cool',
  },
  {
    id: 'anonymous',
    animationAsset: Anonymous,
    animationStyle: {
      height: layoutPtToPx(606),
      width: layoutPtToPx(606),
    },
    primaryText: 'Stay Anonymous',
    secondaryText:
      'All of this, without creating an account. We don’t ask for any permissions either!',
    buttonText: 'That’s awesome',
  },
  {
    id: 'private',
    animationAsset: Secure,
    animationStyle: {
      height: layoutPtToPx(432),
      width: layoutPtToPx(432),
    },
    primaryText: 'Stay Private & Secure',
    secondaryText:
      'All the data is stored only on your device, nowhere else — not even us',
    buttonText: 'Start my Incognito Mode',
    buttonImage: rightArrowIcon,
  },
];

export default LandingScreenCarousalData;
