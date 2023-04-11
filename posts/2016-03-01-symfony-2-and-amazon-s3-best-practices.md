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

This article is dedicated to our experience in Amazon S3 and Symfony 2 integration. Thanks to such bundles as LiipImagineBundle, KnpGaufretteBundlу and VichUploaderBundle this integration is quite a simple task. So let’s begin!

Let’s start with the required bundles installation:

`<br></br>composer require vich/uploader-bundle<br></br>composer require liip/imagine-bundle<br></br>composer require knplabs/gaufrette<br></br>`

In AppKernel.php we add the following lines:

`<br></br>new Knp\Bundle\GaufretteBundle\KnpGaufretteBundle(),<br></br>new Vich\UploaderBundle\VichUploaderBundle(),<br></br>new Liip\ImagineBundle\LiipImagineBundle()<br></br>`

**Example configuration:**

*parameter.yml:*

`<br></br>aws_key: %aws_key_%<br></br>aws_secret_key: %aws_secret_key_%<br></br>aws_region: %aws_region_%<br></br>aws_s3_bucket: %aws_s3_bucket_%<br></br>`

*config.yml:*

`<br></br>#KnpGaufretteBundle:<br></br>knp_gaufrette:<br></br>stream_wrapper: ~<br></br>adapters:<br></br>picture_adapter:<br></br>aws_s3:<br></br>service_id: client.s3 # we describe service client.s3 below<br></br>bucket_name: %aws_s3_bucket%<br></br>options:<br></br>create: true<br></br>directory: photos<br></br>filesystems:<br></br>picture_fs:<br></br>adapter: picture_adapter<br></br>#VichUploaderBundle:<br></br>vich_uploader:<br></br>db_driver: orm<br></br>storage: gaufrette<br></br>mappings:<br></br>picture:<br></br>uri_prefix: https://s3.amazonaws.com/%aws_s3_bucket%/pictures<br></br>upload_destination: picture_fs<br></br>namer: vich_uploader.namer_uniqid<br></br>delete_on_update: true<br></br>delete_on_remove: true<br></br>#LiipImagineBundle<br></br>liip_imagine:<br></br>data_loader: stream.remote<br></br>cache: app_imagine_cache_resolver<br></br>filter_sets:<br></br>36x36:<br></br>quality: 75<br></br>filters:<br></br>thumbnail: { size: [36, 36], mode: inset }<br></br>50x50:<br></br>quality: 75<br></br>filters:<br></br>thumbnail: { size: [50, 50], mode: inset }<br></br>`

*services.xml:*  
`<br></br>#Initialize the client to work with cloud S3:<br></br><service id="client.s3" class="Aws\S3\S3Client" factory-method="factory" factory-class="Aws\S3\S3Client"><br></br><argument type="collection"><br></br><argument key="key">%aws_key%</argument><br></br><argument key="secret">%aws_secret_key%</argument><br></br><argument key="region">%aws_region%</argument><br></br></argument><br></br></service><br></br>`

`<br></br>#This service will be uploading the resized images to S3:<br></br><service id="app.imagine.cache.resolver.amazon_s3" class="Liip\ImagineBundle\Imagine\Cache\Resolver\AwsS3Resolver"><br></br><argument type="service" id="client.s3"/><br></br><argument type="string">%aws_s3_bucket%</argument><br></br><tag name="liip_imagine.cache.resolver" resolver="app_imagine_cache_resolver"/><br></br></service><br></br>`

`<br></br>#To download source images from Amazon add the following service:<br></br><service id="app.liip_imagine.binary.loader.stream.remote" class="ABundle\Service\RemoteStreamLoader"><br></br><tag name="liip_imagine.binary.loader" loader="stream.remote"/><br></br><argument type="service" id="liip_imagine"/><br></br></service><br></br>`

*ABundle\\Service\\RemoteStreamLoader:*

`<br></br>namespace ABundle\Service;<br></br>use Liip\ImagineBundle\Binary\Loader\LoaderInterface;<br></br>use Imagine\Image\ImagineInterface;<br></br>use Imagine\Image\ImageInterface;<br></br>class RemoteStreamLoader implements LoaderInterface<br></br>{<br></br>/**<br></br>* @var ImagineInterface<br></br>*/<br></br>protected $imagine;<br></br>/**<br></br>* @param ImagineInterface $imagine<br></br>*/<br></br>public function __construct(ImagineInterface $imagine)<br></br>{<br></br>$this->imagine = $imagine;<br></br>}<br></br>/**<br></br>* @param mixed $path<br></br>* @return ImageInterface<br></br>*/<br></br>public function find($path)<br></br>{<br></br>// The http:// becomes http:/ in the url path due to how routing urls are converted<br></br>// so we need to replace it by http:// in order to load the remote file<br></br>$path = preg_replace('@\:/(\w)@', '://$1', $path);<br></br>return $this->imagine->load(file_get_contents($path));<br></br>}<br></br>}<br></br>`

Now we can describe the entity class and attach the image to it (pay attention to the annotations Vich\\UploaderBundle\\Mapping\\Annotation):

`<br></br>use Doctrine\ORM\Mapping as ORM;<br></br>use Symfony\Component\HttpFoundation\File\File;<br></br>use Vich\UploaderBundle\Mapping\Annotation as Vich;<br></br>/**<br></br>* @ORM\Table(name="picture")<br></br>* @Vich\Uploadable<br></br>*/<br></br>class Picture<br></br>{<br></br>/**<br></br>* NOTE: This is not a mapped field of entity metadata, just a simple property.<br></br>You can use LifeCallbacks to manage it<br></br>*<br></br>* @Assert\File(maxSize="10M")<br></br>* @Assert\Image()<br></br>* @Vich\UploadableField(mapping="picture", fileNameProperty="pictureName")<br></br>*<br></br>* @var File $picture<br></br>*/<br></br>protected $picture;<br></br>/**<br></br>* @ORM\Column(type="string", length=255, name="picture_name")<br></br>*<br></br>* @var string $pictureName<br></br>*/<br></br>protected $pictureName;<br></br>}<br></br>`

There is a form class for the image (notice: for uploading use the standard field “file”):

`<br></br>namespace ABundle\Form;<br></br>use Symfony\Component\Form\AbstractType;<br></br>use Symfony\Component\Form\FormBuilderInterface;<br></br>class PictureType extends AbstractType<br></br>{<br></br>/**<br></br>* @param FormBuilderInterface $builder<br></br>* @param array $options<br></br>*/<br></br>public function buildForm(FormBuilderInterface $builder, array $options)<br></br>{<br></br>$builder<br></br>->add('picture', 'file', [<br></br>'label' => false,<br></br>'mapped' => false,<br></br>]);<br></br>}<br></br>}<br></br>`

When the form is submitted, the magic VichUploaderBundle will do all your work: save the image in the database and upload it to S3.  
Moreover, we configured Liip so that it keeps resized images in S3.

Display the image in Twig template:

`<br></br>{{ vich_uploader_asset(entity, 'picture') | imagine_filter('50x50') }}<br></br>`

So, we are moving in the right direction. However, a problem may arise if user files are sizable (for example, + 2 MB). The connection will fail before image resizing is completed. In this case you won’t see your image. That’s why you should “warm up” Liip cache (upload all resized images to Amazon S3) in advance by command:

`<br></br>php app/console liip:imagine:cache:resolve --filters=50x50 --filters=36x36<br></br>`

**Congrats! Now we can store the original and resized pictures on the Amazon S3!**

Hope the related links below will be useful for you:

*<https://github.com/KnpLabs/KnpGaufretteBundle>*

*<https://github.com/liip/LiipImagineBundle>*

*<https://github.com/dustin10/VichUploaderBundle>*

*<https://chrome.google.com/webstore/detail/extended-s3-browser/ddmmmnnbkhpkgnkafpflhaoohifpdkmg>*