# codenames-pictures
Online codenames picture game

Make sure to install node.js

Modify codenames_start.bat file

Modify codenames_start.txt file

You can replace any image files you would like, remove existing images, or add your own images by placing them inside client/img/ folder and making sure the file names are continuous from 1 to whatever the total number of images is. Any missing file numbers will show up as blanks in the game. All image files are 300px * 300px. After changing the image folder, you will need to tell the server how many images there are. Modify server/server.js line 27: var num_images = 281; to whatever number you have.
