---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
# Include Table of Contents
include_toc: false

#Include Alpine JS
include_alpinejs: false

# Send data obj into Alpine.data()
# Access using x-data="param_data"
include_data: false

# Data for Alpine.data()
data: none
---

