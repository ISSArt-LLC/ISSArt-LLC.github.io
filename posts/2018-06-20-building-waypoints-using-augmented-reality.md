---
id: 2681
title: 'Building Waypoints Using Augmented Reality'
date: '2018-06-20T15:07:27+08:00'
author: 'Nikolai Baklanov'
layout: post
image: /static/img/2018/06/pexels-photo.jpg
categories:
    - 'Augmented Reality'
    - 'Mobile development'
tags:
    - AR
    - 'augmented reality'
    - GPS
    - 'mobile app'
    - 'mobile application development'
    - Swift
---

## Introduction

A lot of time has passed since Augmented Reality (AR) and Virtual Reality (VR) were introduced to people, and it was a very promising announcement. The new technologies were supposed to change and improve multiple spheres of our life. Now we have a bunch of applications using AR technology. Those applications vary from games (like [Warhammer 40,000 free blade](https://itunes.apple.com/us/app/warhammer-40-000-freeblade/id1043640363?mt=4), [The Machines](https://itunes.apple.com/us/app/the-machines/id1280682965?mt=4)) to some examples that really help us in our everyday life ([AR MeasureKit](https://itunes.apple.com/us/app/ar-measurekit/id1258270451?mt=8), [Sky Guide AR](https://itunes.apple.com/us/app/sky-guide-ar/id576588894?mt=8), [IKEA Place](https://itunes.apple.com/us/app/ikea-place/id1279244498?mt=8)). All those applications use only the phone itself, but the most useful outcome of the technology is when it is combined with another. Augmented reality can be combined with GPS locations to provide visual directions in different situations. Today we have a lot of navigators which guide users from point A to point B. The thing is that the user can't see this path in the real world. Only on the map. And here augmented reality comes to help us. Let's build an augmented reality app which will guide us along the path displayed on the map. To perform augmented reality development, I will use the Swift language, but those examples can be easily converted to Objective-C code.

## A little bit of math

Before diving into Augmented Reality implementation, we need a clear understanding of what we are planning to do. Every position on the surface of the Earth can be represented with two numbers: latitude and longitude.
**Latitude** is the distance between the North or the South Pole and the equator (an imaginary circle around the Earth halfway between the poles). It goes from 0º to 90º for places to the north of the equator, and 0º to -90º for places to the south of the equator.
**Longitude** is the distance from the prime meridian (an imaginary line running from the north to the south through Greenwich, England) to a point in the west or east. It goes from 0 to 180º for places to the east of the prime meridian, and 0º to -180º for places to the west of the prime meridian. For example, if you are in Brazil, your latitude and longitude will be negative, because you are on the southwest side of the Earth:

[![](/static/img/2018/06/earth_map-300x135.png)](/static/img/2018/06/earth_map.png)

Our app will take your position into account and put the marker on the AR scene in that position. Then we take the first position in the path array and build it using the previous marker (the marker of the user's position). Then we will take the second position in the path array and build it using the marker of the first position and so on. To calculate the next waypoint position, we need two values:

1. The distance between two points (the next and current position)
2. The angle between the north (or south) line of the Earth and the line connecting the current and next point, which is called [bearing](https://en.wikipedia.org/wiki/Bearing_%28navigation%29).

[![](/static/img/2018/06/schema-300x241.png)](/static/img/2018/06/schema.png)

If we were talking about a [сartesian coordinate system](https://en.wikipedia.org/wiki/Cartesian_coordinate_system), we could get those calculations by applying the [Pythagorean theorem](https://en.wikipedia.org/wiki/Pythagorean_theorem) and some simple trigonometry, with [sine](https://en.wikipedia.org/wiki/Sine) and [cosine](https://en.wikipedia.org/wiki/Law_of_cosines) operations. But we are talking about latitudes and longitudes of the Earth. And since the surface of the Earth is not flat, the math gets more complex. The distance is calculated by calling just a [method](https://developer.apple.com/documentation/corelocation/cllocation/1423689-distance) of the class [CLLocation](https://developer.apple.com/documentation/corelocation/cllocation). It uses the [Haversine Formula](http://www.igismap.com/haversine-formula-calculate-geographic-distance-earth/) which, from two different latitude/longitude pairs of values, calculates the distance by tracing a line between them that follows the curvature of the Earth. On the other hand, we have to calculate the bearing between two different latitude/longitude pairs of values manually. [This is the formula](http://www.igismap.com/formula-to-find-bearing-or-heading-angle-between-two-points-latitude-longitude/):

**atan2 ( X, Y )**

Where X equals:
**sin(long2 – long1) * cos(long2)**

And Y equals:
**cos(lat1) * sin(lat2) – sin(lat1) * cos(lat2) * cos(long2 – long1)π**

Another thing to consider is that for the matrix transformation, we will have to use [radians](https://en.wikipedia.org/wiki/Radian) instead of degrees as angle units. As the length of the entire circumference is equal to 2π radians (360º), one radian is equal to 180/π degrees. So, our plan is when we receive the array of waypoints from Google service, using the formulas explained above, place a 3D model (or any other object) in the position of the first waypoint relative to your location inside the AR world. Then we put the second waypoint marker relative to the first one and so on.

## Initial settings

First of all, we need to add Google Maps to our project. You can do it using [Google Developers Console](https://console.developers.google.com/). To do that we need to add Google Maps SDK for iOS in our project. You can do it using [CocoaPods](https://cocoapods.org/about) or install it manually. Either way, please, refer to Google Guides for [Google Maps SDK](https://developers.google.com/maps/documentation/ios-sdk/start) for proper installation steps according to the selected method. Then we initialize the view and camera to display our map. It's just a few lines:

```swift
let camera = GMSCameraPosition.camera(withLatitude: lat, longitude: long, zoom: 18.0)
mapView = GMSMapView.map(withFrame: defaultMapView.bounds, camera: camera)
mapView.isMyLocationEnabled = true
mapView.delegate = self
view.addSubview(mapView)
```

Instead of '*lat*' and '*long*' variables you can insert any coordinates you want to center your camera at the start. Or you can use *myLocation* property of *mapView* object to get your current position and center your map on that position. After that we need to implement the ability to place marks on our map, we will use those marks to indicate the start and finish of our path. Adding markers on the map is quite an easy and common task, just implement the delegate method in your view controller class:

```swift
public func mapView(_ mapView: GMSMapView, didTapAt coordinate:   CLLocationCoordinate2D) {
destinationMarker?.map = nil
destinationMarker = GMSMarker(position: coordinate)
destinationMarker!.position.latitude = coordinate.latitude
destinationMarker!.position.longitude = coordinate.longitude
destinationMarker!.map = mapView
}
```

## Working with Google Service

Next, we need to add 'Get Path' button. Callback code for this button will send a request to Google service providing the coordinates of the user position and destination marker position from our map. There are a bunch of ways to perform a GET request to the server, depending on your own preferences and needs and you can implement it in your own way. We need to send a request to the service using the following format: https://maps.googleapis.com/maps/api/directions/**outputFormat?parameters** where **outputFormat** is the desired format of the server answer (can be XML or JSON, we will use JSON) and **parameters** – the request parameters. We will use only five of them, but you can find a whole list of possible parameters [here](https://developers.google.com/maps/documentation/directions/intro). We need to send:

- origin – the coordinates of our path start;
- destination – the end of the path;
- mode – to select our movement type;
- key – needed to provide Googlekey of our app.

Your request should be something like this: https://maps.googleapis.com/maps/api/directions/**json?origin=lat,lng&destination=lat,lng&sensor=true&mode=walking&key=googleKey**. We set JSON as our response format, instead of **lat** and **lng** you should place latitude and longitude of your origin and destination points. I set mode parameter to walking value, but you can select any mode you want. And finally you need to replace **googleKey** with your application Google ID. As a response to this request, you will receive a big JSON containing a bunch of data. We don't need all of this data we need to parse the response and take only routes array from it. Usually this array will contain only one route (if it's possible to build a route between the provided coordinates) and during the response processing we will simply take the first route from this array. The routes in the service response are represented by strings in a special format. All you need to do is:

- parse the service response and take the routes array;
- take the first route string from this array;
- create GMSPath object using this string: GMSPath.init(fromEncodedPath: routeString);
- get GMSPath object waypoints as CLLocations.

The last item of the list can be implemented using the following code:

```swift
for index in 0...path!.count() - 1 {
let pinLocation = CLLocation(coordinate: (path?.coordinate(at: index))!, altitude: 236)
self.locations.append(pinLocation)
}
```

At this point, we have an application with the implemented Google Map display and path finding functions. We can request a path from Google service and process response to get waypoints as CLLocation. Now we can go to the main part of this work – the AR part.

## Implementing augmented reality

First, we will create a new view controller. And add [ARSCNView](https://developer.apple.com/documentation/arkit/arscnview) or [ARSKView](https://developer.apple.com/documentation/arkit/arskview) (the first should be used if you want to add 3D objects to the scene, the latter is for 2D images and sprites) to display the camera and augmented reality objects. To complete our initial setup of the AR scene, we need to add the view to this scene.

```swift
public override func viewDidLoad() {
super.viewDidLoad()
let scene = SCNScene()
sceneView.delegate = self
sceneView.scene = scene
}
```

```swift
override func viewWillAppear(_ animated: Bool) {
super.viewWillAppear(animated)
let configuration = ARWorldTrackingConfiguration()
configuration.worldAlignment = .gravityAndHeading
sceneView.session.run(configuration)
}
```

```swift
override func viewWillDisappear(_ animated: Bool) {
super.viewWillDisappear(animated)
sceneView.session.pause()
}
```

Now we need to import the object that will represent the waypoints on the augmented reality scene. As it was mentioned above, we can use a 3D model or 2D sprite for this purpose. In the code above we used *ARSCNView* and for the waypoints we will use 3D model. If you created your project using Augmented Reality Project template of XCode, then you should have *art.scnassets* folder in your project workspace. If you have used any other template, you need to create this folder yourself. To do that Next, open the New File dialog and scroll down to choose the *Asset Catalog* type. In the name field enter: *art.scnassets* and confirm extension changing (from xcassets to scnassets).

When you have art.scnassets folder inside your project, you need to add all needed visual resources (sprites, textures, models etc) in there. Most common 3D model formats used in iOS AR applications are .dae and .obj. We need to copy our model file in art.scnassets folder. Then return to XCode, open the Scene Graph View, select the main node of your model and, in the properties tab, give it a name, which you'll use to reference it in the code for example: '*waypoint*'.

## Implementing position calculations

Now we will get back to the formulas from the beginning of this article and implement them in the code. To translate geo position coordinates in augmented reality scene coordinates we will use the function:

```swift
func translateNode (_ location: CLLocation) -> SCNVector3  {
let locationTransform = transformMatrix(matrix_identity_float4x4, userLocation, nextWaypoint)
return positionFromTransform(locationTransform)
}
```

Main calculations are hidden behind **transformMatrix** function. To calculate the transformation matrix we:

1. Use an identity matrix (we don't have to use the matrix of the camera or something like that, the position and orientation of the waypoint are independent of your position and orientation).
2. Calculate the bearing using the formula explained in the previous section: atan2 (sin(long2 – long1) \* cos(long2),cos(lat1) \* sin(lat2) – sin(lat1) \* cos(lat2) \* cos(long2 – long1))
3. Using an identity matrix, get a rotation matrix in the y-axis using that bearing.
4. The distance is given by the z-axis, so create a four-element vector with the distance in the z position to get a translation matrix.
5. Multiply both matrices (remember, the order is important) to combine them.
6. Get the final transformation by multiplying the result of the previous step with the matrix passed as an argument.

Those steps can be implemented in the following way (main transform function):

```swift
func transformMatrix(_ matrix:simd_float4x4,_ originLocation:CLLocation, _ waypointLocation: CLLocation) -> simd_float4x4 {
let bearing = <strong>bearingBetweenLocations</strong>(userLocation, waypointLocation)
let rotationMatrix = <strong>rotateAroundY</strong>(matrix_identity_float4x4, Float(bearing))
let position = vector_float4(0.0, 0.0, -distance, 0.0)
let translationMatrix = getTranslationMatrix(matrix_identity_float4x4, position)
let transformMatrix = simd_mul(rotationMatrix, translationMatrix
return simd_mul(matrix, transformMatrix)
}
```

Here goes the function for step 2 from the sequence above. We calculate the bearing, note that we are using radians instead of degrees, as it was mentioned above:

```swift
func bearingBetweenLocations(_ originLocation: CLLocation, _ waypointLocation: CLLocation) -> Double {
let lat1 = originLocation.coordinate.latitude.toRadians()
let lon1 = originLocation.coordinate.longitude.toRadians()
let lat2 = waypointLocation.coordinate.latitude.toRadians()
let lon2 = waypointLocation.coordinate.longitude.toRadians()
let longitudeDiff = lon2 - lon1
let y = sin(longitudeDiff) * cos(lat2);
let x = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(longitudeDiff);
return atan2(y, x)
}
```

Next, we need a rotation matrix:

```swift
func rotateAroundY(_ matrix: simd_float4x4, _ degrees: Float) -> simd_float4x4
{
var matrix = matrix
matrix.columns.0.x = cos(degrees)
matrix.columns.0.z = -sin(degrees)
matrix.columns.2.x = sin(degrees)
matrix.columns.2.z = cos(degrees)
return matrix.inverse
}
```

Then we need the translation matrix to work with the distance value.

```swift
func getTranslationMatrix(_ matrix:simd_float4x4, _ translation:vector_float4)->simd_float4x4 {
var matrix = matrix
matrix.columns.3 = translation
return matrix
}
```

All that we need to do now is to apply our **transformMatrix** function to all coordinates from Google Service and put markers or place 3D models on converted coordinates (instead of **waypoint.dae** you should use the name of your model):

```swift
let modelScene = SCNScene(named: "art.scnassets/<strong>waypoint.dae</strong>")!
self.modelNode = modelScene.rootNode.childNode(withName: rootNodeName, recursively: true)!
self.modelNode.position = translateNode(location)
sceneView.scene.rootNode.addChildNode(self.modelNode)
```

## Conclusion

This AR application can be used to guide users from one waypoint to another along the whole path. It's not a new trend in the augmented reality technology and in the mobile development in general. We have some AR applications guiding users inside airport buildings. The main difference between those applications and our example is that we are using the real user geolocation and position and converting them to the augmented reality coordinates.

In the current implementation augmented reality solution is not very comfortable for users. The main point of this demo is to show how to work with a real geoposition and apply it to augmented reality. To make this technique viable, we should develop this kind of application for HoloLens or Google Glass.