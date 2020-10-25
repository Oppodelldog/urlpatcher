releaseDir=release
targetFile="release/url-patcher.zip"
bundle:
	mkdir -p $(releaseDir)
	[ -e $(targetFile) ] && rm $(targetFile)
	zip -r $(targetFile) background icons popup manifest.json
