sudo sysctl -w kern.maxfiles=1048600
sudo sysctl -w kern.maxfilesperproc=1048576
ulimit -S -n 1048576
ulimit -S -n
