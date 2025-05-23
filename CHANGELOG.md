# Changelog


## 2025-05-01
- remove deps from build artifacts ([8e0ba9e](https://github.com/mjt-engine/mb/commit/8e0ba9ef170291f2b9f2a98bc94628ebf0e904c7)) by Matt Taylor

## 2025-04-25
- only include subjec ton span for request/Many ([b64795f](https://github.com/mjt-engine/mb/commit/b64795f33570a14973c0a11a220803cee391eb7f)) by Matt Taylor
- added observation of Channel ([0010ff9](https://github.com/mjt-engine/mb/commit/0010ff961b0d8cd272d426980a81517b28c54b0e)) by Matt Taylor
- finer detailed request observation ([35abf66](https://github.com/mjt-engine/mb/commit/35abf6654131c52baa947cc766a1a554f325f5f7)) by Matt Taylor
- bump observe dep ([45f9ac1](https://github.com/mjt-engine/mb/commit/45f9ac1236a2f870a481c2f394f2e49278198ba6)) by Matt Taylor
- bump observe dep ([5034d63](https://github.com/mjt-engine/mb/commit/5034d639210f80b017b28e7902e7d39751cf5b3d)) by Matt Taylor
- default ChannelMessage to unknown data type ([855b334](https://github.com/mjt-engine/mb/commit/855b334b21f640f976992bfe3808c85d49d07151)) by Matt Taylor
- default EmitterChannel to unknown type ([ac7ec3f](https://github.com/mjt-engine/mb/commit/ac7ec3f9ad4b0317d103cb5c97c73228645b1b8d)) by Matt Taylor
- defulat to unknown SerializedData ([a84ed8c](https://github.com/mjt-engine/mb/commit/a84ed8c5e2e838113e06409f01e9be4afc813aca)) by Matt Taylor
- exported Serializer type ([970c09d](https://github.com/mjt-engine/mb/commit/970c09d6c4ab254aad3fada61d007a144b80ae05)) by Matt Taylor
- added optional serialization ([0c19649](https://github.com/mjt-engine/mb/commit/0c1964942ce277ea54a4e054b340bc2813cb8e5c)) by Matt Taylor

## 2025-04-23
- bumped observe dep ([22f8c74](https://github.com/mjt-engine/mb/commit/22f8c7490c18c3283d0823766a3c6ef6006e6ade)) by Matt Taylor
- add binary serialization back, turns out it is faster ([5f5f835](https://github.com/mjt-engine/mb/commit/5f5f835d51dc9787340493697eb3be77bbcb09dd)) by Matt Taylor
- fake bytes transform to test for performance ([bb9f8e0](https://github.com/mjt-engine/mb/commit/bb9f8e0f339852da8c500bc89093cb758aefaed8)) by Matt Taylor
- bump observe dep ([09ce2d7](https://github.com/mjt-engine/mb/commit/09ce2d70160781d4e12e62c2bcef109f30423d50)) by Matt Taylor
- better pattern for obs span ([b980ec1](https://github.com/mjt-engine/mb/commit/b980ec1de3d041523c16870530bac7668bfb7e4f)) by Matt Taylor
- remove debug logging ([368b0c1](https://github.com/mjt-engine/mb/commit/368b0c1b551b8d04ea94b6c356258abffcf8b971)) by Matt Taylor
- debug mb obs ([8114583](https://github.com/mjt-engine/mb/commit/811458314bc4905c2ea1f572ce0d9bc55ca12eec)) by Matt Taylor
- added observe to mb ([b0b3a31](https://github.com/mjt-engine/mb/commit/b0b3a31f89130ff35e5b995d9ee98f278ed4dd27)) by Matt Taylor
- Added removeAllListners to Emitter type ([027d7ba](https://github.com/mjt-engine/mb/commit/027d7ba39d7468b8e21d9346d951c333056e45bf)) by Matt Taylor

## 2025-04-22
- ConnectionMap as a PartialSubject ([7d4de0a](https://github.com/mjt-engine/mb/commit/7d4de0a46b454475b1ba1bba2f53b35b35751e10)) by Matt Taylor
- add selector to emitter Channel Emitter interface ([5f8e595](https://github.com/mjt-engine/mb/commit/5f8e595932cdcb0dc965e01e1ab05d4764733a5a)) by Matt Taylor
- abort caller immediately on calback for _once_ ([d1da646](https://github.com/mjt-engine/mb/commit/d1da646c89ef4fac345655b340b0d233cb94f28a)) by Matt Taylor
- added better signal logic for aborted signals ([9d4282c](https://github.com/mjt-engine/mb/commit/9d4282cb1560c94face088d2d81ffa464d9b49f5)) by Matt Taylor
- describe where timeouts happen ([cc6a53e](https://github.com/mjt-engine/mb/commit/cc6a53eaa579c81577c7887a780afc10d7b9436a)) by Matt Taylor
- added subscribe test ([381f9dc](https://github.com/mjt-engine/mb/commit/381f9dc92343ea097fd0bc11458182d40beeac7a)) by Matt Taylor

## 2025-04-21
- added subscribe method to MessageBus ([d08830d](https://github.com/mjt-engine/mb/commit/d08830de419a313b50859a452a1d8006088b92cf)) by Matt Taylor
- cleaned up ergonomics of MB API ([5eb05de](https://github.com/mjt-engine/mb/commit/5eb05de04029cc60f6c02b15e05ef0c880caff85)) by Matt Taylor
- remove dist from ignore ([55f0e5f](https://github.com/mjt-engine/mb/commit/55f0e5faf89d71a39b051ff5dd9f5916a69f28df)) by Matt Taylor
- export channel types ([dcd8fb5](https://github.com/mjt-engine/mb/commit/dcd8fb5f943b04b1502cf0e37b687157a6a62e9c)) by Matt Taylor
- cleaned up API ([6acac5e](https://github.com/mjt-engine/mb/commit/6acac5e3d141080fca35dda560fe5526e442b699)) by Matt Taylor
- Emitter interface created to ease transition to browser env ([985a9e6](https://github.com/mjt-engine/mb/commit/985a9e6a6816301382b1453c25d17e1e2e841205)) by Matt Taylor
- code cleanup ([60f829d](https://github.com/mjt-engine/mb/commit/60f829d65df2ea25f1f32f905a92cfb0b781d624)) by Matt Taylor
- fully working MQ ([69e06f1](https://github.com/mjt-engine/mb/commit/69e06f1df3b87119fce14fb1f2012e4c03369e27)) by Matt Taylor

## 2025-04-20
- basic MQ works ([e0bef1c](https://github.com/mjt-engine/mb/commit/e0bef1c4d83d371dc0f18129a962b5f934568f1b)) by Matt Taylor
- callbacks on listners now transform the async-itr result ([4e6cb4b](https://github.com/mjt-engine/mb/commit/4e6cb4bdb1f516c40d15b41fd9235d9579a85e47)) by Matt Taylor
- basic testing of MQ ([97572e3](https://github.com/mjt-engine/mb/commit/97572e380b3b87b53d02d83d8a587c1023c8085e)) by Matt Taylor

## 2025-04-19
- added async Channel listen iter ([c6e65f3](https://github.com/mjt-engine/mb/commit/c6e65f38c40c046c99199a28959e6b8fb32a7905)) by Matt Taylor
- Channels ([3e41a49](https://github.com/mjt-engine/mb/commit/3e41a49f5ea48ddfda9f6b11079f28193eb521b2)) by Matt Taylor
- bump bytes dep to fix node issues, added type building ([66f6a23](https://github.com/mjt-engine/mb/commit/66f6a23372e8e1c93e44cda629d753713c3d9787)) by Matt Taylor
- initial commit ([2556a81](https://github.com/mjt-engine/mb/commit/2556a81be299f5b8745d7cd7331d9bf0d1fcba70)) by Matt Taylor
