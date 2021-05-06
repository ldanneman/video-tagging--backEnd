import os

exclude = ["node_modules", ".git"]
for root, dirs, files in os.walk("./"):
	for i in exclude:
		if exclude i in dirs:
			dirs.remove(exclude i)
		for file in files:
			print(f"Dealing with file {root}/{file}")


# for root, dirs, files in os.walk("."):
# 	for file in files:
# 		if "node_modules" not in dirs:
# 			if(file.endswith(".txt")):
# 				# print(os.path.join(root,file))
# 				print(f"Dealing with file {root}/{file}")

