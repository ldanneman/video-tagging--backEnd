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
                *.env)
                        continue
                        ;;
                *.txt*)
                # t=$(sed -n '/const/,/=/p' $file)
                # echo $t
                # grep -Po 'const\K.*(?==)' $file
                # grep -B 1 running $file
                # declare -A t
                # t=$(grep -Po 'const\K.*(?==)' $file)
                # echo $t
                # grep -Po 'const\K.*(?==)' $file
                # sed -e 's/.* \([[:digit:]]\{1,\}\) processes running\./\1/' $file
                # grep -B1 "smile" $file
                # grep -Eo '.{3}processes.{1}' $file
                # grep -F '=' file | cut -d ' ' -f 3 $file
                # grep (?<=\s>\s)?[^\s>]\w+(?=\s>\s)? $file

                                # grep -F 'processes' file | cut -d ' ' -f 3 $file
                                awk -F'=' '{print $1}' $file
                # grep -Po "[[:a-z:]]+ *(?=processes)" $file
                
                    #  sed -e 's/const\(.*\)=/\1/' $file
                    # sed -i 's/\(const\).*\(=\)/\1 foo \2/g' $file


                # sed -i 's/\(const\).*\(=\)/\1 foo \2/g' $file


                    # z=sed -e 's/goodbye\(.*\)is/\1/'
                    # z=sed -n '/goodbye/,/is/p'
                    # sed -i 's/'"${z}"'/what/' $file
                #    sed -n "/goodbye/,/is/p" $file

                                    # sed -i 's/hello/goodbye/' $file

                    
                    
                    # nl $file
                    # echo $file
                    ;;
                *)
                        #But we want to process everything else                        
                        ;;
        esac

done
                        # var1=$(foo | sha512sum)
                        # var2="Aksjdksjdowjeqkdwskdjkwjewpejwqkjdh3geiywdfyisvdhksbdjwgqeiuwqvdhwqbdkhbwhqdbvHSDHSKAH3we3qwvqhjwscfAGVXGHWAGEYTRjsgdjsduswetuochjxnjsguisdiuwdjkwqndsajxgsahxfyiljkashkdhsaxSJDGWJREYIUREWJCDSAIEUYRYEBXHXUSUkjahjaswwwwe3483274uegjaskdjakhqwkeyrieuijewkdsalxjsaodaudioueirkjwqdksahcxkanxkjlkwpdiASJJUR937493IUEJEWDHUEWFUFJLKLDSKLCJR9374932EOI32EOJEWIFDHKDHISHAICYDSUFOIEWFUO32IURE03284EmxnmncddsclpwfopewioirouewrikjfkdsknfjdbjbfjgdhfgewfjhscdkskcvdqereredsacdcdkjkdjfdfkhdjfyuetrujcdcnjkcnkjciwsdsdfdrgrfrfkewyruewytruwfghdscbjdnkcwdeSDFHETY676546534534T5EHYTJUOTERFREWFERWT465765856YHTNMBVCXXSDFGHJKLOIYTEWFsdkdjeiu4i3wrjkewkjdewr3oeru932846532ujkewdlc"
                        # var4="kahdkjhskjdhqiu3yruehjfdkjksmckmdsciwurepo32ue832ytrtfueskjc26348647932RUDIEWH8EWDIDJFIDWLKJFEWO8YR84YRHFEWFIDSCJDSJOEWJEOFDEWIRYU348YRU3REWKDJKSKJCKDKJKJDKJFIEYR8T3RYFHIHDKSKDCLKLKDLKWQELRIUOEURIFksjdkjdojiejrjkrjfejfkjkjfkdlcxljldjfejlfjlejfljewlflkelfklekrljelrjlewjfljefeojfojlrjlejfljeljfleour3u4r8397493ojdlmslsld987r939r3y93ojrewoude9r937ojwodq;wjdoKJSKJEKWJEK3OJER3RJO3984003OORJEWFJEWLFJEW2736T72345YUEWDISJDKJOjjsgdt7wuewoeewfewfdewefewdjewkrllpeiueuvcmxeekjfdjekdjskjkdyriueirjekjfkehwfkpew3837483y4hrejhrejrwjgjchjdkjifSKJDIWEUR3IUREWHEWFEWFHEKWFCBJWVJHFKEWUEWUROEWUROEWUROEURIEFHJHKFJVOWFIUOEIPEIEWFUEWEIRHERERJEWkhkhsfidkcoclkvlsnvnvfoewu"
                        # var3=$var2$var1$var4
                        # echo $var1



