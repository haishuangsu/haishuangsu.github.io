# 异常处理

[toc]{type: "ul", level: [2,3,4,5]}

## Futter 异常
Flutter 异常指的是，Flutter 程序中 Dart 代码运行时意外发生的错误事件。我们可以通过 与 Java 类似的 try-catch 机制来捕获它。但与 Java 不同的是，Dart 程序不强制要求我们 必须处理异常。

这是因为，Dart 采用事件循环的机制来运行任务，所以各个任务的运行状态是互相独立 的。也就是说，即便某个任务出现了异常我们没有捕获它，Dart 程序也不会退出，只会导 致当前任务后续的代码不会被执行，用户仍可以继续使用其他功能。

Dart 异常，根据来源又可以细分为 App 异常和 Framework 异常，Flutter 为这两种异常 提供了不同的捕获方式。

### App 异常
App 异常，就是应用代码的异常，通常由未处理应用层其他模块所抛出的异常引起。

App 异常可以分为两类，即同步异常和异步异常:
+ 同步异常可以通 过 try-catch 机制捕获
+ 异步异常则需要采用 Future 提供的 catchError 语句捕获


#### App 异常的捕获方式
```dart

// 使用 try-catch 捕获同步异常 
try {

}catch(e) { 
  print(e);
}

// 使用 catchError 捕获异步异常
 Future.delayed(Duration(seconds: 1))
    .then((e) => throw StateError('This is a Dart exception in Future.'))
    .catchError((e)=>print(e));


// 注意，以下代码无法捕获异步异常 
try {
  Future.delayed(Duration(seconds: 1))
      .then((e) => throw StateError('This is a Dart exception in Future.'))
}
catch(e) {
  print("This line will never be executed. ");
}


```



####  集中管理

同步的 try-catch 和异步的 catchError，为我们提供了直接捕获特定异常的能力，而如果 我们想集中管理代码中的所有异常，Flutter 也提供了 Zone.runZoned 方法。

::: tip Zone
我们可以给代码执行对象指定一个 Zone，在 Dart 中，Zone 表示一个代码执行的环境范 围，其概念类似沙盒，不同沙盒之间是互相隔离的。如果我们想要观察沙盒中代码执行出现 的异常，沙盒提供了 onError 回调函数，拦截那些在代码执行对象中的未捕获异常。
:::

在下面的代码中，我们将可能抛出异常的语句放置在了 Zone 里。可以看到，在没有使用 try-catch 和 catchError 的情况下，无论是同步异常还是异步异常，都可以通过 Zone 直 接捕获到:
```dart

runZoned(() {
// 同步抛出异常
throw StateError('This is a Dart exception.');
}, onError: (dynamic e, StackTrace stack) {
  print('Sync error caught by zone');
});


runZoned(() {
// 异步抛出异常 
Future.delayed(Duration(seconds: 1))
      .then((e) => throw StateError('This is a Dart exception in Future.'));
}, onError: (dynamic e, StackTrace stack) {
  print('Async error aught by zone');
});

```



### Framework 异常
Framework 异常，就是 Flutter 框架引发的异常，通常是由应用代码触发了 Flutter 框架 底层的异常判断引起的。比如，当布局不合规范时，Flutter 就会自动弹出一个触目惊心的 红色错误界面。

这其实是因为，Flutter 框架在调用 build 方法构建页面时进行了 try-catch 的处理，并提 供了一个 ErrorWidget，用于在出现异常时进行信息提示:

```dart
 @override
void performRebuild() {
    Widget built;
    try {
        // 创建页面
        built = build();
    }catch (e, stack) {
    // 使用 ErrorWidget 创建页面
    built = ErrorWidget.builder(_debugReportException(ErrorDescription("building $this"
     ...
    } 
    ...
 }

```

#### 自定义错误提示页面
我们通常会重写 ErrorWidget.builder 方法，将这样的错误提示页面替: 
```dart
ErrorWidget.builder = (FlutterErrorDetails flutterErrorDetails){
    return Scaffold(
        body: Center(
            child: Text("Custom Error Widget"),
        )
    ); 
};
```


#### Framework 异常的捕获方式


##### 集中管理
为了集中处理框架异常，Flutter 提供了 FlutterError 类，这个类的 onError 属性会在接 收到框架异常时执行相应的回调。

```dart

FlutterError.onError = (FlutterErrorDetails details) async {
  // 转发至 Zone 中 
  Zone.current.handleUncaughtError(details.exception, details.stack);
};

runZoned<Future<Null>>(() async {
  runApp(MyApp());
}, onError: (error, stackTrace) async {
 //Do sth for error
});

```
