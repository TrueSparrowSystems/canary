import {Canary, rightArrowIcon} from '../../assets/common';

const LandingScreenCarousalData = [
  {
    id: 'welcome',
    imageAsset: Canary,
    primaryText: 'Welcome to Canary',
    secondaryText:
      'A privacy-focused app which lets you browse content from Twitter without being tracked',
    buttonText: 'Tell me more',
  },
  {
    id: 'discover',
    imageAsset: Canary,
    primaryText: 'Discover Content',
    secondaryText:
      'Personalize your home feed, search for topics, archive tweets, and create lists',
    buttonText: 'Sounds Pretty Cool',
  },
  {
    id: 'anonymous',
    imageAsset: Canary,
    primaryText: 'Stay Anonymous',
    secondaryText:
      'All of this, without creating an account. We don’t ask for any permissions either!',
    buttonText: 'That’s awesome',
  },
  {
    id: 'private',
    imageAsset: Canary,
    primaryText: 'Stay Private & Secure',
    secondaryText:
      'All the data is stored only on your device, nowhere else — not even us',
    buttonText: 'Start my Incognito Mode',
    buttonImage: rightArrowIcon,
  },
];

export default LandingScreenCarousalData;
