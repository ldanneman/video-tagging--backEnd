for i in {1..5}
do
   echo "Welcome $i times"
done

for (( c=1; c<=5; c++ ))
do  
   echo "Hello $c times"
done

for file in "/root/EyeKnow-Backend/Controller/"
do
	echo $file
done


for file in /etc/*
do
	if [ "${file}" == "/etc/tigrc" ]
	then
		countNameservers=$(grep -c nameserver /etc/tigrc)
		echo "Total  ${countNameservers} nameservers defined in ${file}"
		break
	fi
done

DB_AWS_ZONE=('us-east-2a' 'us-west-1a' 'eu-central-1a')
 
# for f in $(ls /nas/*.pdf)
# do
#   print "File $f"
# done


# for file in $(find Scripts/)
# do
# 	[ "$file" != *_Scripts/etc/_* ] && echo $file
# done

# cat $(ls Scripts/etc/aaa.txt)

for file in $(find *)
do
        case "$file" in
                node_modules*)
                        #We want to skip this
                        continue
                        ;;
                *.json*)
                        continue
                        ;;
                *.txt*)
                    # sed -i 's/hello/goodbye/g' $file
                #    sed -n "/goodbye/,/is/p" $file
                    # z=sed -e 's/goodbye\(.*\)is/\1/' $file
                    
                    # nl $file
                    # echo $file
                    ;;
                *)
                        #But we want to process everything else
                        
                        ;;
        esac
done


