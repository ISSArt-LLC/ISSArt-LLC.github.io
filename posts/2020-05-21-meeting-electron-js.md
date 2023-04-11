---
id: 3721
title: 'Meeting Electron.js'
date: '2020-05-21T15:00:00+08:00'
author: 'Alexey Gritskevich'
layout: post
image: /static/img/2020/05/Electron-logo-light.png
categories:
    - 'Web Development'
tags:
    - desktop
    - development
    - electron
    - js
    - react
    - web
---

## What is Electron.js?

Hi. I’m a junior web-developer and in this article I’ll tell you about my meeting with Electron.js, describe a couple of challenges I struggled with and share my opinion about the future of this technology.

**Electron** is a platform with an open source code that helps developer to create pseudo-native applications using already known technologies such as JavaScript, HTML, and CSS with Node.js runtime environment as a back-end and Chromium as a front-end. The developer of it is GitHub Inc.

#### Advantages:

- Works on all common desktop platforms such as Windows, Mac, Linux
- Different integrations with operating system: Menu, Notifications, Tray, Keyboard Shortcuts, Native File Drag &amp; Drop
- Implemented Crash Reporting, Automatic Updates and Win Installers
- Web-developers can use them for a fast start and creation of apps in a well-known environment

#### Disadvantages:

- App is supplied with all the environment and as a result: 
    - Great usage of hdd space
    - Great usage of memory

#### Some examples of a successful use:

- Development – Atom, Visual Studio Code, Mongotron, Avocode
- Messengers – Slack, Skype, Discord
- Others – Walling, Actual, Lector

#### Alternatives*:*

- **NW.js –** the aim of the project is absolutely the same, it came up earlier but less popular. It uses higher level of approach and full integration of functions of web-browser, developed by Intel.

## Challenges I faced when using Electron.js

So now you know pros and cons of this tool. It’s time to tell you about things that every developer will face using this platform.

### **Integration:** Common for all of us: Menu, Notification, Tray

The first that comes to the mind, when we want to integrate our app into OS, when we need to make menu, notification and icon in tray. To make this functionality we have API that helps us to resolve these tasks:  
[_Menu.buildFromTemplate_](https://www.electronjs.org/docs/api/menu#menubuildfromtemplatetemplate)
  
[Menu.setApplicationMenu](https://www.electronjs.org/docs/api/menu#menusetapplicationmenumenu)
  
[menu.popup](https://www.electronjs.org/docs/api/menu#menupopupoptions)
  
[new Notification](https://www.electronjs.org/docs/api/notification#new-notificationoptions-experimental)
  
[new Tray](https://www.electronjs.org/docs/api/tray#new-trayimage)
  
[tray.setContextMenu](https://www.electronjs.org/docs/api/tray#traysetcontextmenumenu)

You should pay attention to some options and methods that can be special for the platform. If you want to show dynamic menu in tray, you need to create a pattern with renewed data and install it again. Talking about icon in tray, you need to be sure that the object that will bring *[new Tray()](https://www.electronjs.org/docs/api/tray#new-trayimage)* back wasn’t deleted by trash collector. It seems that junior developers face it so often that it is even described in the documents.

### **Condition:** Condition between Main Process and Render Process

This task is less trivial and to solve it we have several ways. First of all, a few words about architecture of Electron. We have two independent processes Main and Render. The last one can be several that correspond to windows in OS. We need data exchange between Main and Render processes.  
By reading the documentation you can find different solutions:

- **[Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage)** – well-known to web-developers API to store data in client that helps to exchange data only by Render processes
- method *remote.getGlobal(sharedObject)* – the use of object *[remote](https://www.electronjs.org/docs/api/remote)* specific for the platform with the help of which Render Process can receive data sent from Main Process
- modules *[ipcMain](https://www.electronjs.org/docs/api/ipc-main#ipcmain)* and [*ipcRenderer*](https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderer) **–** interaction that does not always suit because it is directed only from Render process to Main process. For the reverse interaction we need method *webContents.send()*

If you use such libraries as React and Redux, you have to find other ways to support general state. I used library [**electron-redux**](https://github.com/hardchor/electron-redux), using it we create Store in both processes and the library with Middlewares will take care about the data in our Store are the same.

### **Distribution**: Creating package or installer for Windows

It is an important step in the development of your app. In the documentation there are several variants of delivering the app to the final clients:

- **[electron-forge](https://github.com/electron-userland/electron-forge)**
- **[electron-builder](https://github.com/electron-userland/electron-builder)**
- **[electron-packager](https://github.com/electron/electron-packager)**

My choice was electron-builder that gives you a wide range of formats and gives you flexibility. I had another short-period experience with electron-packager using which was not so friendly – I didn’t manage to assemble Windows Installer **[Squirrel](https://github.com/Squirrel/Squirrel.Windows)**.

You should keep in mind that to assemble for Windows on the platform different from it, you need to instal **[Wine](https://www.winehq.org/)**.

## Conclusion

Electron – is a platform with a big community and support of big companies that helps web-developers to create apps for desktop systems. Its advantages are hard to overestimate:

- fast development – developers can use their knowledge and have the same code base with web-version of the app.
- modern design – the lack of limitations to the appearance

My experience was positive and made me think of such popular projects as React Native and Proton Native.

**Sources**:

Official sources – <https://www.electronjs.org/> , <https://ru.wikipedia.org/wiki/Electron>

Alternatives – <https://ru.wikipedia.org/wiki/NW.js>