# Engine 环境搭建
[toc]{type: "ul", level: [2,3,4,5]}

## 源码获取

### 下载 depot_tools
```cmd
mkdir flutter_source
cd flutter_source

git clone https://chromium.googlesource.com/chromium/tools/depot_tools
# 设置到Path
export PATH=$PATH:`pwd`/depot_tools
```

### 配置.gclient
```js
solutions = [
    {
        "managed": False,
        "name": "src/flutter",
        "url": "git@github.com:flutter/engine.git",
        "custom_deps": {},
        "deps_file": "DEPS",
        "safesync_url": ""
    }
]
```

### 下载依赖
输入 gclient sync 开始下载 flutter/engine 及其依赖，由于网络，可能会有很长一段时间没反应。
```cmd
gclient sync

```


### 调整 Engine 版本
#### 查看当前 flutter framework 与 engine的对应版本：
```cmd
cat bin/internal/engine.version
```

#### 切换 engine 版本：
```cmd
cd src/flutter
git checkout xxx
```

#### 同步
engine 在切换时DEPS文件自然也有可能改变，在src/flutter下执行：
```cmd
gclient sync --with_branch_heads --with_tags
```


## 源码目录
### flutter/flutter 的目录结构
```cmd
bin
 ├── dart
 ├── dart.bat
 ├── flutter # flutter tool 的启动脚本
 ├── flutter.bat
 └── internal
        ├── README.md
        ├── canvaskit.version
        ├── engine.version # Framework 对应的 Engine 版本
        ├── shared.bat
        ├── shared.sh  # flutter 命令的内部逻辑
        ├── update_dart_sdk.sh  #Flutter SDK 的更新逻辑
        └── usbmuxd.version
examples # Flutter 示例工程
packages
    ├── analysis_options.yaml
    ├── flutter # Flutter SDK 源码
    ├── flutter_driver  # Flutter 集成测试相关代码
    ├── flutter_goldens # Flutter UI 测试相关代码
    ├── flutter_goldens_client
    ├── flutter_localizations # 国际化相关代码
    ├── flutter_test    # Flutter(单元) 测试相关代码
    ├── flutter_tools   # Flutter tool 的源码
    ├── flutter_web_plugins # Flutter Web 相关代码
    ├── fuchsia_remote_debug_protocol
    └── integration_test
version # Flutter SDK 版本
```

### flutter/engine 的目录结构
```cmd
assets  # 资源读取
common  # 公共资源
display_list
docs
examples
flow    # 渲染管道相关逻辑
flutter_frontend_server # Dart 构建相关逻辑
fml     # 消息循环相关逻辑
lib
runtime
shell
   ├── platform
          ├── BUILD.gn
          ├── android # Android Embedder 相关
          ├── common  # Embedder 公共逻辑
          ├── darwin
          ├── embedder
          ├── fuchsia
sky
testing # 测试相关
third_party
vulkan
web_sdk
```
