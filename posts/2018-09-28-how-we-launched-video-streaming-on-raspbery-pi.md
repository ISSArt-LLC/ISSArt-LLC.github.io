---
id: 2895
title: 'How we launched video streaming on Raspbery Pi'
date: '2018-09-28T13:55:30+08:00'
author: 'Evgeny Zhiryakov'
layout: post
image: /static/img/2018/09/fall-1673041_1920.jpg
categories:
    - General
---

##### How we decided to launch a system of video streaming

As in any other company, in ours there is some outdated equipment. It is quite workable, but cannot be used by employees. So, there are monitors, system units, and many other little computer parts like old-fashioned PS/2 mice and keyboards lying useless.

In this article we are going to talk about monitors we decided to use as an announcement board.

As the source of videos it was decided to use a Raspberry Pi.

Raspberry Pi is quite a weak hardware, but it suits our purpose well.

The Broadcom chip installed in the Raspberry Pi has hardware video acceleration support that allows you to play H.264 video with a bit rate of 40 MBits/s.

It's rather good for such a small board.

##### The first experience

Let's start with the story of the first experience of video streaming.

Well, not exactly video streaming, first it was just one monitor and one Raspberry Pi board.

There was nothing complicated: we installed a cross-platform media player, saved the video files on a flash drive and started their cyclic playback, perfect!

The screens displayed employees' current month's birthdays, and such information is quite useful at a company of our size.

There were also announcements of the upcoming events and photo and video records of them. In general, everyone liked the idea.

But there was a screen only on one floor of the office, the matter was we wanted to cover the entire audience. That's why a second monitor was bought and a second Raspberry board, and then we went through all the same steps again.

Everything worked fine, but we wanted more, besides, updating files on each screen separately was rather tiresome.

##### The improvement of the system

The idea was the following:

We set up the streaming from the server to all the screens, as a result, we get a centralized streaming, and on all screens the same information is always displayed.

In the previous version, there was mal-synchronization, because there was no simultaneous start, it was not very important while the screens were on different floors.

But at some point, there were multiple screens, and mal-synchronization started to be too obvious, which a perfectionist couldn't bear.

We had had experience setting streaming using VideoLAN, and we wanted to use it.

Thus, we set up the server on Debian Linux, installed VLC, placed video files on the server and started streaming.

##### Challenges

However, not everything started going smoothly right away, and in the process of introducing the video streaming system, we faced various challenges.

***1. The cross-platform media player was not very convenient, we wanted a real Linux Way***

The media player we use is a multimedia processor, it does a lot, but at the same time it consumes more resources, and we only need one function — to reproduce the video stream.

Since the media player turned out to be too bulky for the task, it was decided to use another media player.

For this purpose, the basic version of Debian Linux was installed on the Raspberry Pi.

***2. Finding a suitable media player***

To take full advantage of the video hardware acceleration, we took the OMXPlayer, because it is a console media player with OpenMAX hardware acceleration.

On the Raspberry Pi, the installation does not cause any problem, because there is a package in the default repository.

apt-get install omxplayer

After the installation, you can run "omxplayer –live udp://@:1234" and the player is ready to accept the stream.

***3. Optimization of parameters***

Since most of the RAM was freed up, there appeared a possibility to reallocate the physical memory to increase graphics memory.

For this you need to edit the file **/boot/config.txt**

**Having added gpu_mem=256 to it**

***4. OMXPlayer is very sensitive to the parameters of the video stream***

For example, it used to fall displaying a cheerful phrase "have a nice day", whenever the bit rate of the video stream was changed.

And those days were really "nice", because now we know the cause, but then it was a mystery.

We started preparing to stream video-files with the same settings, and it helped, streamings stopped interrupting.

But sometimes the human factor intervened, and the playlist had at least one file with parameters different from the others, and then all went wrong.

##### The final version of the system

Once again I wanted to change things for the better and prevent unpleasant surprises and the human factor.

The solution was found quickly, but getting from the idea to realization was not at all easy.

The solution itself was to make the video files with the same parameters converted completely automatically, without any human participation.

No, a human is still required, but only to put the playlist together and place the video files in the network folder.

Starting from this point on everything is done automatically.

At midnight when everyone is asleep, video-files start being converted and after the completion of the process the streaming restarts.

The streaming started, and the image appeared on the screen. It's probably the same feeling that the first television watchers experienced.

To implement the plan, the Bash script was written:

```

#!/bin/bash

### Path to FFmpeg
FFMPEG=/usr/local/bin/ffmpeg

### Path to logo
LOGO=/Converter_new/logo.png

### Work dirs without trailing slash
INFILES=/Converter_new/videos
OUTDIR=/Converter_new/videos_out
TEMPDIR=/Converter_new/temp_out
MD5DIR=/Converter_new/fingerprints

### Cleaning filenames
rename "s/ /_/g" $INFILES/*
rename "s/'//g" $INFILES/*
rename "s/'//g" $INFILES/*
rename "s/,//g" $INFILES/*
rename "s/\!//g" $INFILES/*
rename "s/\№//g" $INFILES/*
rename "s/\050/_/g" $INFILES/*
rename "s/\051//g" $INFILES/*
rename "s/\.\././g" $INFILES/*
rename "s/\._/_/g" $INFILES/*
rename "s/__/_/g" $INFILES/*

function converting {
file_to_convert=$1
converted_file=$2

### We want HD Ready (1280x720)
frame_width=1280
frame_high=720

$FFMPEG -i $file_to_convert -i $LOGO -r 25 -codec:v libx264 -profile:v high -level 3.2 -preset veryslow -g 15 -crf 18 -pix_fmt yuv420p -maxrate 4000k -bufsize 2000k \
-filter_complex "[0:v]scale=iw*min($frame_width/iw\,$frame_high/ih):ih*min($frame_width/iw\,$frame_high/ih),pad=$frame_width:$frame_high:($frame_width-iw)/2:($frame_high-ih)/2[v1];[v1][1:v]overlay=main_w-overlay_w-10:10" \
-threads 0 -af dynaudnorm -c:a aac -ac 2 -ar 44100 -b:a 128k -y $TEMPDIR/$converted_file
### Save some disk space
dd if=/dev/urandom bs=1 count=128 2>/dev/null | base64 -w 0 | rev | cut -b 2- | rev > $file
### Create MD5 hash for file
md5sum $file_to_convert | cut -d " " -f1 > $TEMPDIR/$converted_file.md5
STREAMING_RESTART=1
}

function find_converted {
file_md5=$1
converted_file=$2

echo " Trying to find converted video..."
for md5_file in $MD5DIR/*
do
FINDED=0
md5_search=`cat $md5_file`
if [ "$file_md5" = "$md5_search" ]
then
echo " Lucky day! We finded it in $(basename "$converted_file")."
tempfile=`echo $md5_file | awk -F/ '{print$(NF)}' | awk -F.md5 '{print($1)}'`
cp $OUTDIR/$tempfile $TEMPDIR/$converted_file
mv $md5_file $TEMPDIR/$converted_file.md5
FINDED=1
STREAMING_RESTART=1
break
fi
done
}

### Take action on each file in INFILES path.

### Initializing variables
i=1
CONVERTED=0

### $file_to_convert store current file name wit absolute path.
for file_to_convert in $INFILES/*
do
echo "Processing $(basename "$file_to_convert") file..."

### Does the file exist?
if [ ! -f $file_to_convert ]
then
echo "ERROR: $(basename "$file_to_convert") does not exist - aborting"
exit 1
fi

### Does the file non zero lenght?
if [ -z $file_to_convert ]
then
echo "ERROR: $(basename "$file_to_convert") is empty - aborting"
exit 1
fi

### Setting output filename format
### 001.mp4 002.mp4 003.mp4 etc.
converted_file=$(printf "%0.3d.mp4" $i)
i=$((i + 1))

### Path to file's saved md5sum
fingerprintfile=$MD5DIR/$converted_file.md5

### Create the md5sum from the file to check in future
file_md5=`md5sum $file_to_convert | cut -d " " -f1`

### Do we have allready an saved fingerprint of this file?
if [ -f $fingerprintfile ]
then
### Get the saved md5
saved_md5=`cat $fingerprintfile`

### Check if it's empty
if [ -z $saved_md5 ]
then
echo "WARNING: The file is empty"
saved_md5=0
fi

### Compare the saved md5 with the one we have now
if [ "$saved_md5" = "$file_md5" ]
then
echo " File has not been changed"
mv $fingerprintfile $TEMPDIR/$converted_file.md5
mv $OUTDIR/$converted_file $TEMPDIR/$converted_file
else
echo " File has been changed or renamed"
find_converted $file_md5 $converted_file

if [ $FINDED -ne 1 ]; then
converting "$file_to_convert" "$converted_file"
fi
fi
else
find_converted $file_md5 $converted_file

if [ $FINDED -ne 1 ]; then
converting $file_to_convert $converted_file
fi

fi
done

echo "Moving converted files and md5 files."
if [ "$(ls -A $MD5DIR)" ]; then
echo "Take action $MD5DIR is not Empty"
rm $MD5DIR/*.md5
fi

if [ "$(ls -A $OUTDIR)" ]; then
echo "Take action $OUTDIR is not Empty"
rm $OUTDIR/*.mp4
fi

mv $TEMPDIR/*.md5 $MD5DIR/
mv $TEMPDIR/*.mp4 $OUTDIR/

if [ $STREAMING_RESTART -eq 1 ]; then
echo "Concatating converted files."
for f in $OUTDIR/*; do echo "file '$file_to_convert'" >> $TEMPDIR/mylist.txt; done
$FFMPEG -f concat -i $TEMPDIR/mylist.txt -c copy -y /Converter_new/All_in_one.mp4
rm $TEMPDIR/mylist.txt

### Stop streaming
echo "Stopping streaming..."
VLC_pid=`cat /var/run/vlc.pid`
kill -9 $VLC_pid >> /dev/null 2>&1
rm -f /var/run/vlc.pid
sleep 5
### Start streaming
echo "Starting streaming..."
/usr/bin/vlc /Converter_new/All_in_one.mp4 --intf rc --rc-host 127.0.0.1:4567 --rc-fake-tty --loop --file-caching 0 --sout-keep --sout-mux-caching 0 \
--sout-udp-caching 0 --sout-udp-group 50000 --sout-ts-shaping 1000 --sout-ts-use-key-frames --no-drop-late-frames --no-skip-frames \
--sout "#gather:duplicate{\
dst=std{access=udp,mux=ts,dst=172.17.8.201:1234},\
dst=std{access=udp,mux=ts,dst=172.17.8.202:1234},\
dst=std{access=udp,mux=ts,dst=172.17.9.88:1234},\
dst=std{access=udp,mux=ts,dst=172.17.8.204:1234},\
dst=std{access=udp,mux=ts,dst=172.17.8.205:1234}}" >> /var/log/vlc.log 2>&1 &
sleep 5
ps ax | grep "/usr/bin/vlc" | head -1 | awk -F " " '{ print $1 }' > /var/run/vlc.pid

fi
```

We hope you will find this post about our experience useful.

***Have you had experience of launching a video streaming system? Feel free to tell us in the comments!***