from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.http import StreamingHttpResponse
from fpm.models import *
from django.contrib.auth.decorators import login_required
from django.utils.encoding import escape_uri_path
@login_required(login_url='/login')
def DonwloadView_Submit(request):
    if request.method=="POST":
        fb_id = request.POST['fb_id']
        f = feedback_content.objects.get(id=fb_id)
        file_path = f.feedback_file_submit
        def file_iterator(fn, chunk_size=512):
            while True:
                c = fn.read(chunk_size)
                if c:
                    yield c
                else:
                    break

        file_path = "./"+str(file_path)
        fn = open(file_path, 'rb')
        filename = file_path.split("/")[-1]
        response = StreamingHttpResponse(file_iterator(fn))
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = "attachment; filename*=utf-8''{}".format(escape_uri_path(filename))
        return response

@login_required(login_url='/login')
def DonwloadView_Replay(request):
    if request.method == "POST":
        fb_id = request.POST['fb_id']
        f = feedback_content.objects.get(id=fb_id)
        file_path = f.feedback_file_reply

        def file_iterator(fn, chunk_size=512):
            while True:
                c = fn.read(chunk_size)
                if c:
                    yield c
                else:
                    break

        file_path = "./" + str(file_path)
        fn = open(file_path, 'rb')
        filename = file_path.split("/")[-1]
        response = StreamingHttpResponse(file_iterator(fn))
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = "attachment; filename*=utf-8''{}".format(escape_uri_path(filename))
        return response

@login_required(login_url='/login')
def DonwloadView_Doc_Download(request,settings_id):
    s = settings.objects.get(id=settings_id)
    doc_file_path = s.doc_file_path

    def file_iterator(fn, chunk_size=512):
        while True:
            c = fn.read(chunk_size)
            if c:
                yield c
            else:
                break

    file_path = str(doc_file_path)
    fn = open(file_path, 'rb')
    filename = file_path.split("/")[-1]
    response = StreamingHttpResponse(file_iterator(fn))
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = "attachment; filename*=utf-8''{}".format(escape_uri_path(filename))
    return response