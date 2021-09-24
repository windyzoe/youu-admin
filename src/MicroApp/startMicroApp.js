import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start, initGlobalState } from 'qiankun';

const loader = loading => {};

const getActiveRule = hash => location => location.hash.startsWith(hash);

/**
 * @description qiankun的启动方式,等容器节点加载完毕后再启动哦
 * @author Zachary.X
 * @date 2021-01-20
 */
export default function startMicroApps(props) {
  registerMicroApps(
    [
      {
        name: 'myApp1',
        entry: '/myApp1/index.html',
        container: '#myApp1',
        loader,
        activeRule: getActiveRule('#/myApp1'),
      },
    ],
    {
      beforeLoad: [
        app => {
          console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
        },
      ],
      beforeMount: [
        app => {
          console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
        },
      ],
      afterUnmount: [
        app => {
          console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
        },
      ],
    }
  );

  const { onGlobalStateChange, setGlobalState } = initGlobalState(props);

  onGlobalStateChange((value, prev) => console.log('[onGlobalStateChange - master]:', value, prev));

  // setGlobalState({
  //   ignore: 'master',
  //   user: {
  //     name: 'master',
  //   },
  // });

  runAfterFirstMounted(() => {
    console.log('[MainApp] first app mounted');
  });

  start();
}
