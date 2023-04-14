---
id: 1588
title: 'Symfony 2 and Amazon S3: the best practices'
date: '2016-03-01T16:41:45+08:00'
author: 'Eugene Paranyuk'
layout: post
image: /static/img/2016/02/puzzle-1152793_1280.jpg
categories:
    - General
    - 'Web Development'
---

This article is dedicated to our experience in Amazon S3 and Symfony 2 integration. Thanks to such bundles as LiipImagineBundle, KnpGaufretteBundlу and VichUploaderBundle this integration is quite a simple task. So let's begin!

Let's start with the required bundles installation:

```bash
$ composer require vich/uploader-bundle
$ composer require liip/imagine-bundle
$ composer require knplabs/gaufrette
```

In AppKernel.php we add the following lines:

```php
new Knp\Bundle\GaufretteBundle\KnpGaufretteBundle(),
new Vich\UploaderBundle\VichUploaderBundle(),
new Liip\ImagineBundle\LiipImagineBundle()
```

**Example configuration:**

*parameter.yml:*

```yml
aws_key: %aws_key_%
aws_secret_key: %aws_secret_key_%
aws_region: %aws_region_%
aws_s3_bucket: %aws_s3_bucket_%
```

*config.yml:*

```yml
#KnpGaufretteBundle:
knp_gaufrette:
stream_wrapper: ~
adapters:
picture_adapter:
aws_s3:
service_id: client.s3 # we describe service client.s3 below
bucket_name: %aws_s3_bucket%
options:
create: true
directory: photos
filesystems:
picture_fs:
adapter: picture_adapter
#VichUploaderBundle:
vich_uploader:
db_driver: orm
storage: gaufrette
mappings:
picture:
uri_prefix: https://s3.amazonaws.com/%aws_s3_bucket%/pictures
upload_destination: picture_fs
namer: vich_uploader.namer_uniqid
delete_on_update: true
delete_on_remove: true
#LiipImagineBundle
liip_imagine:
data_loader: stream.remote
cache: app_imagine_cache_resolver
filter_sets:
36x36:
quality: 75
filters:
thumbnail: { size: [36, 36], mode: inset }
50x50:
quality: 75
filters:
thumbnail: { size: [50, 50], mode: inset }
```

*services.xml:*
```xml
#Initialize the client to work with cloud S3:
<service id="client.s3" class="Aws\S3\S3Client" factory-method="factory" factory-class="Aws\S3\S3Client">
<argument type="collection">
<argument key="key">%aws_key%</argument>
<argument key="secret">%aws_secret_key%</argument>
<argument key="region">%aws_region%</argument>
</argument>
</service>
```

```xml
#This service will be uploading the resized images to S3:
<service id="app.imagine.cache.resolver.amazon_s3" class="Liip\ImagineBundle\Imagine\Cache\Resolver\AwsS3Resolver">
<argument type="service" id="client.s3"/>
<argument type="string">%aws_s3_bucket%</argument>
<tag name="liip_imagine.cache.resolver" resolver="app_imagine_cache_resolver"/>
</service>
```

```xml
#To download source images from Amazon add the following service:
<service id="app.liip_imagine.binary.loader.stream.remote" class="ABundle\Service\RemoteStreamLoader">
<tag name="liip_imagine.binary.loader" loader="stream.remote"/>
<argument type="service" id="liip_imagine"/>
</service>
```

*ABundle\\Service\\RemoteStreamLoader:*

```php
namespace ABundle\Service;
use Liip\ImagineBundle\Binary\Loader\LoaderInterface;
use Imagine\Image\ImagineInterface;
use Imagine\Image\ImageInterface;
class RemoteStreamLoader implements LoaderInterface
{
/**
* @var ImagineInterface
*/
protected $imagine;
/**
* @param ImagineInterface $imagine
*/
public function __construct(ImagineInterface $imagine)
{
$this->imagine = $imagine;
}
/**
* @param mixed $path
* @return ImageInterface
*/
public function find($path)
{
// The http:// becomes http:/ in the url path due to how routing urls are converted
// so we need to replace it by http:// in order to load the remote file
$path = preg_replace('@\:/(\w)@', '://$1', $path);
return $this->imagine->load(file_get_contents($path));
}
}
```

Now we can describe the entity class and attach the image to it (pay attention to the annotations Vich\\UploaderBundle\\Mapping\\Annotation):

```php
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
/**
* @ORM\Table(name="picture")
* @Vich\Uploadable
*/
class Picture
{
/**
* NOTE: This is not a mapped field of entity metadata, just a simple property.
You can use LifeCallbacks to manage it
*
* @Assert\File(maxSize="10M")
* @Assert\Image()
* @Vich\UploadableField(mapping="picture", fileNameProperty="pictureName")
*
* @var File $picture
*/
protected $picture;
/**
* @ORM\Column(type="string", length=255, name="picture_name")
*
* @var string $pictureName
*/
protected $pictureName;
}
```

There is a form class for the image (notice: for uploading use the standard field "file"):

```php
namespace ABundle\Form;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
class PictureType extends AbstractType
{
/**
* @param FormBuilderInterface $builder
* @param array $options
*/
public function buildForm(FormBuilderInterface $builder, array $options)
{
$builder
->add('picture', 'file', [
'label' => false,
'mapped' => false,
]);
}
}
```

When the form is submitted, the magic VichUploaderBundle will do all your work: save the image in the database and upload it to S3.
Moreover, we configured Liip so that it keeps resized images in S3.

Display the image in Twig template:

```php
{{ vich_uploader_asset(entity, 'picture') | imagine_filter('50x50') }}
```

So, we are moving in the right direction. However, a problem may arise if user files are sizable (for example, + 2 MB). The connection will fail before image resizing is completed. In this case you won't see your image. That's why you should "warm up" Liip cache (upload all resized images to Amazon S3) in advance by command:

```bash
$ php app/console liip:imagine:cache:resolve --filters=50x50 --filters=36x36
```

**Congrats! Now we can store the original and resized pictures on the Amazon S3!**

Hope the related links below will be useful for you:

*<https://github.com/KnpLabs/KnpGaufretteBundle>*

*<https://github.com/liip/LiipImagineBundle>*

*<https://github.com/dustin10/VichUploaderBundle>*

*<https://chrome.google.com/webstore/detail/extended-s3-browser/ddmmmnnbkhpkgnkafpflhaoohifpdkmg>*