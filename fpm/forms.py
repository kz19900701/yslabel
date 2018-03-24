#!/usr/bin/env python
# -*- coding:utf-8 -*-
from django import forms
from django.core import validators
# from django.core.exceptions import ValidationError


class upload_form(forms.Form):
    error_css_class = 'error'
    required_css_class = 'required'
    settings_name = forms.CharField()
    content_id = forms.IntegerField()
    feedback_file = forms.FileField(required=False)
    feedback_question = forms.CharField(required=True,error_messages={'required': '详细描述不能为空.'})

    def clean_sample_type(self):
        data = self.cleaned_data['feedback_file'] +"_"+str(self.cleaned_data['content_id'])+ "_" +self.cleaned_data['settings_name']
        return data


class reply_form(forms.Form):
    error_css_class = 'error'
    required_css_class = 'required'
    fb_id = forms.IntegerField()
    feedback_reply_file = forms.FileField(required=False)
    feedback_answer = forms.CharField(required=True,error_messages={'required': '详细描述不能为空.'})

