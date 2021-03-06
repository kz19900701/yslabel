# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-03-12 19:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fpm', '0016_feedback_content'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback_content',
            name='content',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='feedback_content',
            name='feedback_answer',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='feedback_content',
            name='feedback_question',
            field=models.TextField(),
        ),
    ]
