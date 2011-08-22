#!/bin/sh

usage()
{
cat << EOF
usage: $0 options

This script will search all pom.xml and change <version>ORIG</version> to <version>NEW</version>  

BASIC OPTIONS:
   -h      Show this message
   -d      Destination directory, otherwise the PWD is used 
   -o      Version to replace - such as 4-SNAPSHOT
   -n      Version to replace with - such as 5
   
   BUGS: This is traverse into tags as well, so some may need to be reverted
   
EOF
}

work()
{
  
if  [ -d "$DESTINATION" ]
then
   echo "Beginning version update from base directory: $DESTINATION"
else
   echo "Base directory does not exist, can not update version from: $DESTINATION"
   exit 1;
fi

EXCLUSIONS="'*/target/*' '*/.git/*' '*/build/scripts/*'"
OMIT_PATHS=""
for exclude in $EXCLUSIONS; do
	OMIT_PATHS="$OMIT_PATHS -not -path $exclude"
done

   echo
   echo =================================
   echo "Changing <version>$ORIG_VERSION</version> into <version>$NEW_VERSION</version>" for all POMs

   eval "find $DESTINATION -name 'pom.xml' $OMIT_PATHS -exec sed -ri 's#<version>$ORIG_VERSION<\/version>#<version>$NEW_VERSION<\/version>#' {} \;"

   echo =================================
   echo "Changing $ORIG_VERSION into $NEW_VERSION for all other files"
   echo =================================

   eval "find $DESTINATION -type f $OMIT_PATHS -exec grep -q '$ORIG_VERSION' {} \; -exec sed -ri 's#$ORIG_VERSION#$NEW_VERSION#g' {} \; -print"
   
   echo =================================

}

DESTINATION=`pwd`
WORK=1
ORIG_VERSION=
NEW_VERSION=

while getopts "n:o:d:h" OPTION
do
     case $OPTION in
         n)
             NEW_VERSION=$OPTARG
             ;;
         o)
             ORIG_VERSION=$OPTARG
             ;;
         d)
             DESTINATION=$OPTARG
             ;;
         h)
             usage
             WORK=0
             ;;
         [?])
             usage;
             WORK=0
             ;;
     esac
done

if [ "$WORK" -eq "1" ] || [ "$#" -eq "0" ]
then
   work;
fi
