+++
title = "{{ replace .Name "-" " " | title }}"
date = "{{ .Date }}"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."

tags = [{{ range $plural, $terms := .Site.Taxonomies }}{{ range $term, $val := $terms }}"{{ printf "%s" $term }}",{{ end }}{{ end }}]

# Add toc just above title
include_toc = false

# Add Alpine JS CDN
include_alpinejs = false

# Send data obj into Alpine.data()
include_data = false
+++

This is a page about »{{ replace .Name "-" " " | title }}«.
