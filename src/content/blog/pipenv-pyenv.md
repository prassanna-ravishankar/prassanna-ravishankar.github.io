---
title: "Pipenv and Pyenv - The Python Productivity Combo"
description: "A guide to setting up a productive Python environment using Pipenv and Pyenv"
pubDate: 2019-05-29
heroImage: "/images/blog/python-deps.png"
tags: ["Python", "Pipenv", "Pyenv", "Development", "Productivity"]
author: "Prassanna Ravishankar"
draft: false
---

## Why?

I am a python developer and I like wrapping C++ code into python. Python has some amazing programming paradigms and it allows you to design complex structures in seconds. I've been through the trouble of some weird complex dependencies and add work to configure my python environments. In the python world, the requirements.txt file is simple insufficient to represent your dependencies. This got magnified when I wanted to write in python 3, but wanted to support python 2 and test on them.  There have been a couple of PEPs (this one and that one) about that, but no one tool was good enough. To manage your virtual environments, especially if you're running Python 2 and 3.  Now, we have a pair of tools – Pyenv and Pipenv, which allow for a nice way to marry your Python versions, Virtual Environments, and dependencies in one integrated way!
I have the install guide and the usage guide in the end, and some examples here and there.


### What I am assuming
- You're probably a python developer
- You maintain or develop on multiple python versions, or with projects with varying kinds of dependencies
- Therefore, you know about pip and understand the terminal
- You've probably heard of virtualenv or pyenv or both
- You probably understand how paths go with python.
Going to assume that you work on an Ubuntu flavour of linux, or at least you can - translate my instructions to whatever OS you use.
- This is literally an Ubuntu 18.04 pyenv + pipenv install guide

Now that I've got that sorted, let me move on. If you want to skip all the justification and just figure out how to install them both, scroll down or click here. 

### Virtualenv is just-not-enough

Now, now, don't let the haters come my way already. Virtualenv was an awesome tool when it did come out, it was an awesome way to maintain dependencies for one project. It was awesome when you didn't need to sudo into your linux box and install every damn package into the python's system libraries. and write It was awesome when you could contain yourself within your predefined environment going:-

```bash
    source bin/activate
    pip install -r requirements.txt
    pip install BeautifulSoup
    vim configuration.py
    python run_tracker.py
    vim requirements.txt
    source bin/deactivate
```

Your workflow probably was something similar. You activated a virtualenv, you installed your packages, ran whatever was required. Edited some code, added dependencies and added it to your requirements.txt. And then you went on to work on a different project, updated it. If you had custom dependency management or depended on environment variables, you probably wrote it into the activate script itself.


### You still tried to manage it well ...
Virtualenvwrapper then came along, and it simplified your life with virtualenvs a bit. You could call activate scripts in a much easier way, you could play with your environments, you could activate and deactivate them as you pleased.

```bash
    mkvirtualenv my_project_env
    mkvirtualenv my_project_testbench_env
    workon my_project_env
    # Run my project here
    # Make some changes
    # Test and run the project.
    deactivate
```

Super awesome again, when you want to work with different environments, each with a different set of requirements. But passing dependency changes, was still an issue, you had to pass a requirements.txt  as well – too much work!

And then, python3 came along, and it changed your life. Your project probably had to be supported for python3 and python2. You could always create another virtualenv that uses another version of system python, but then how could you test for multiple versions of python, some that are maybe not distributed by your system's package manager, like a combination of python 2.7.8, 2.7.12, 3.5, 3.6, 3.4. You can't install and compile everything everything, and then you just assume it might work and stick to one version – that's where your bugs will arise from. That's when virtualenv stopped being awesome, it couldn't foresee the future, and you wished you weren't a python developer.


## Enter pyenv
pyenv is this awesome tool, especially created to maintain your projects under different versions of python. It makes maintaining multiple python versions super easy! Now you could install multiple versions of python with not too many clicks, and play around as much as you want

You activate whichever version of python you want to use. You then do do some changes project with python2.  It changes only for that project folder, you so don't really affect the global python environment. You can cd in and out without a worry. There's also a feature in the new version of pycharm where in it can understand pyenv versions.

```bash
# You activate whatever version of python you want to use
$ pyenv activate 2.7.12

$ pyenv versions
* system (set by /home/prassanna/.pyenv/version)
  2.7.12
  3.2.6
  3.8-dev

$ pyenv local 2.7.12 

$ pyenv which python
/home/prassanna/.pyenv/versions/2.7.12/bin/python

$ cd ..

$ pyenv which python
/usr/bin/python
```

If you are a die hard pyenv fan, you could go this way and just have virutalenv (that's what I had till last week) along with a nice little plugin. pyenv-virtualenv allows for some fancy project management. You can cd into multiple folders,  with multiple sets of dependencies and still get far from a headache 

```bash
$ ls
my_new_project

$ cd my_new_project 

$ pyenv virtualenv 2.7.12 project_env
Collecting virtualenv
....
Installing setuptools, pip, wheel...done.

$ pyenv local project_env 

$ (project_env) pyenv which python
/home/prassanna/.pyenv/versions/project_env/bin/python

# I forget to put a version number
$ (project_env) vim requirements.txt
$ (project_env) cat requirements.txt 
BeautifulSoup


# Just because I like autocomplete
$ (project_env) pip install bpython 

$ (project_env) pyenv which python
/home/prassanna/.pyenv/versions/project_env/bin/python

$ (project_env) pip install -r requirements.txt
Collecting BeautifulSoup (from -r requirements.txt (line 1))
....
Successfully built BeautifulSoup
Installing collected packages: BeautifulSoup
Successfully installed BeautifulSoup-3.2.1

# bpython automatically prints the python version
$ (project_env) bpython
bpython version 0.17.1 on top of Python 2.7.12 /home/prassanna/.pyenv/versions/2.7.12/envs/project_env/bin/python2.7
>>> import BeautifulSoup
>>> bs = BeautifulSoup.BeautifulSoup()
>>> # you do some fancy processing here
>>> bs.contents

# Lets cd out 
$ (project_env) cd ..
$ bpython
pyenv: bpython: command not found

The `bpython' command exists in these Python versions:
  2.7.12/envs/project_env
  project_env


# Lets double check if we have BeautifulSoup in the end
$ python
Python 2.7.15rc1 (default, Apr 15 2018, 21:51:34) 
[GCC 7.3.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import BeautifulSoup
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ImportError: No module named BeautifulSoup
>>> exit()

$ pyenv which python
/usr/bin/python
```

You can automate a bunch of stuff and isolate your environment, but you're  still relying on developer provided requirements.txt . This is not the best thing because developers often forget to give you a version number, and if some method gets called that's recently depreciated, your application crash. Then, you go back fix the version number and add it to your requirements.txt, and send this as an issue to do the developer and then he fixes it. Unnecessary, and should be easy to automate.

We need a tool, a tool that a developer uses to fix their package dependencies automatically. It should just store the hash of the python package each time they use pip.  That file should be distributed. And if things go wrong, a hash mismatch occurs and raises an alarm.


## Pipenv – The new way things go

pipenv is the new "official" way to handle environments and their dependencies. They closely tie package management into the environment tool. It draws similarities from npm and the likes and builds from there.
In order to fix the drawbacks with dependencies and their management, pipenv tries to go a long way. It switches from the requirements.txt to a much more beautiful Pipfile system – which is the new way python does things.

You install and manage your environment with the same command pipenv. pipenv install <package-name> is used instead of pip install <package-name>. Your workflow would then change into something much more beautiful

```bash
$ cd my_new_project 

$ pipenv shell
Creating a Pipfile for this project...
Launching subshell in virtual environment…
 . /home/prassanna/.local/share/virtualenvs/my_new_project-_ivudYLh/bin/activate

$ (my_new_project-_ivudYLh) pip install flask
.....
Adding flask to Pipfile's [packages]...
Pipfile.lock not found, creating...
Locking [dev-packages] dependencies...
Locking [packages] dependencies...
Updated Pipfile.lock (c3d3b3)!
Installing dependencies from Pipfile.lock (c3d3b3)...
  🐍   ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ 6/6 — 00:00:01
```

Awesome! Your packages get dependency-checked in the dumber, but more useful Pipfile.lock. It also get's recorded in the Pipfile. In  essence Pipfile is the new requirements.txt that uses TOML. Pipfile.lock, on the other hand, knows about dependencies and their hashes. This helps in locking down a specific set of dependencies for a perfect reproduction, even if the virtualenv gets deleted.

```bash
$ cat Pipfile
[[source]]
url = "https://pypi.org/simple"
verify_ssl = true
name = "pypi"

[dev-packages]

[packages]

[requires]
python_version = "2.7"

# A much much more detailed Pipfile.lock


$ cat Pipfile.lock 
{
    "_meta": {
        "hash": {
            "sha256": "ace08b0ebaac88893742f5cd0b0488823594b6de62fefdeb29506073fac3d3b3"
        },
        "pipfile-spec": 6,
        "requires": {
            "python_version": "2.7"
        },
        "sources": [
            {
                "name": "pypi",
                "url": "https://pypi.org/simple",
                "verify_ssl": true
            }
        ]
    },
    "default": {
        "click": {
            "hashes": [
                "sha256:2335065e6395b9e67ca716de5f7526736bfa6ceead690adf616d925bdc622b13",
                "sha256:5b94b49521f6456670fdb30cd82a4eca9412788a93fa6dd6df72c94d5a8ff2d7"
            ],
            "markers": "python_version >= '2.7' and python_version != '3.0.*' and python_version != '3.1.*' and python_version != '3.2.*' and python_version != '3.3.*'",
            "version": "==7.0"
        },
        "flask": {
            "hashes": [
                "sha256:2271c0070dbcb5275fad4a82e29f23ab92682dc45f9dfbc22c02ba9b9322ce48",
                "sha256:a080b744b7e345ccfcbc77954861cb05b3c63786e93f2b3875e0913d44b43f05"
            ],
            "index": "pypi",
            "version": "==1.0.2"
        },
        "itsdangerous": {
            "hashes": [
                "sha256:cbb3fcf8d3e33df861709ecaf89d9e6629cff0a217bc2848f1b41cd30d360519"
            ],
            "version": "==0.24"
        },
        "jinja2": {
            "hashes": [
                "sha256:74c935a1b8bb9a3947c50a54766a969d4846290e1e788ea44c1392163723c3bd",
                "sha256:f84be1bb0040caca4cea721fcbbbbd61f9be9464ca236387158b0feea01914a4"
            ],
            "version": "==2.10"
        },
        "markupsafe": {
            "hashes": [
                "sha256:a6be69091dac236ea9c6bc7d012beab42010fa914c459791d627dad4910eb665"
            ],
            "version": "==1.0"
        },
        "werkzeug": {
            "hashes": [
                "sha256:c3fd7a7d41976d9f44db327260e263132466836cef6f91512889ed60ad26557c",
                "sha256:d5da73735293558eb1651ee2fddc4d0dedcfa06538b8813a2e20011583c9e49b"
            ],
            "version": "==0.14.1"
        }
    },
    "develop": {}
}
```

And if you have complete environment isolation as well. You get out of the environment by just exitting. No more complicated source activate or deactivate

```bash
$ (my_new_project-_ivudYLh) 
$ (my_new_project-_ivudYLh) exit  

# Flask doesn't work inside
$ my_new_project python
>>> import flask
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ImportError: No module named flask
>>> exit()

# Let me go back into my shell and see if anything has changed
# It remembers my shell 
$ pipenv shell
Launching subshell in virtual environment…
 . /home/prassanna/.local/share/virtualenvs/my_new_project-_ivudYLh/bin/activate
$ . /home/prassanna/.local/share/virtualenvs/my_new_project-_ivudYLh/bin/activate

$ (my_new_project-_ivudYLh) python
>>> import flask
>>> exit()

```

This was all done with pipenv using Pyenv behind-the-scenes. Pyenv is pretty awesome, we want to use Pyenv along with pipenv. We could have multiple strange versions of python and installed and all of them could still go well. You use pyenv the first time to (re-)install the environment, and then forget about pyenv all together, using pipenv for everything from package management to environment handling. 


### Pyenv and pipenv could create some oddities though …

Sometimes pipenvs might be created in another version of Pyenv. But pipenv remembers it's python version, so always ends up calling the right Python environment – the same version that was used to create it. Just that it's probably better off to trust Pipenv more than Pyenv.

```bash
$ cd Projects 

$ Projects ls

$ mkdir my_new_project

# Assuming pyenv is installed, and I have some nice environments
$ pyenv which python
/home/prassanna/.pyenv/versions/2.7.12/bin/python

$ cd my_new_project 

# This is pre-pipenv
$ pyenv which python
/home/prassanna/.pyenv/versions/2.7.12/bin/python

# I have 3.8-dev installed from earlier, remember?
$ my_new_project pyenv shell 3.8-dev

# I had one from before, but this would create it again anyway :)
$ pipenv install --python=`pyenv which python`
Virtualenv already exists!
Removing existing virtualenv...
Creating a virtualenv for this project...
...
Virtualenv location: /home/prassanna/.local/share/virtualenvs/my_new_project-_ivudYLh
...

# Let me go back to my previous shell
$ pyenv shell 2.7.12

# This doesnt know about pipenv
$ pyenv which python
/home/prassanna/.pyenv/versions/2.7.12/bin/python

# Lets see pipenv
$ pipenv shell
Launching subshell in virtual environment…
 . /home/prassanna/.local/share/virtualenvs/my_new_project-_ivudYLh/bin/activate

# pyenv is wrong in knowing about his shell
$ (my_new_project-_ivudYLh) pyenv which python
/home/prassanna/.pyenv/versions/2.7.12/bin/python

# Notice that it is 3.8
$ (my_new_project-_ivudYLh) python
Python 3.8.0a0 (heads/master:df81015, Sep 30 2018, 00:28:23) 
[GCC 7.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> exit()

# 3.8 as expected, pipenv works fine!
$ (my_new_project-_ivudYLh) python --version
Python 3.8.0a0

$ (my_new_project-_ivudYLh) exit 

# On exiting, the python version is back to 2.7.12
$ python --version
Python 2.7.12
```
Now that I've justified pyenv and pipenv, let's get onto installing them …


## Installing the environment

These are specific instructions for Ubuntu 18.04 , but with a little of common sense may be adapted to any python installation. These probably will not work in anaconda based environments

## Pyenv

Let's start off by installing Pyenv.  We will then install Pipenv on top of that to allow for pipenv to get access to multiple python versions of pyenv

#### Step 1 – Requirements

The pyenv installation guide doesn't explicitly mention these requirements, but my pyenv install <python-version-number>' command didn't work for multiple versions, either for the lack of zlib or ssl. It's listed in the section of pyenv in Common Build Problems, but it's much easier off doing it in the beginning. I added in libssl1.0-dev which was needed for 18.04.

```bash
sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev \
libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev \
xz-utils tk-dev libffi-dev liblzma-dev libssl1.0-dev
```

#### Step 2 – Cloning and pointing pyenv

Installing pyenv is rather easy – we just need a git clone.

```bash
git clone https://github.com/pyenv/pyenv.git ~/.pyenv
```

Don't forget to add it to your .bashrc or .zshrc . Also add the pyenv-init script to allow for awesome autocompletes and other nifty features. Check out pyenv's github repository, if you're interested in another OS.

```bash
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.bashrc

# Skip the following if you don't have zsh or you haven't heard of it
# Even if you have it, it's always nice to have it on bash as well. 
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.zshrc
```

Restart your shell and you're good to go, you have pyenv installed
```
exec $SHELL
```

#### Step 3 – Install a version of python with pyenv

In this case, let's download the old school python 2.7.12 and the new and latest 3.8-dev. This is just for illustration purposes. Feel free to add whatever you want.

```bash
# You probably install all the environments you want at one go
# Python 2.7.12 &  then install 3.8-dev as well
$ pyenv install 2.7.12               
Downloading Python-2.7.12.tar.xz...
-> https://www.python.org/ftp/python/2.7.12/Python-2.7.12.tar.xz
Installing Python-2.7.12...
Installed Python-2.7.12 to /home/prassanna/.pyenv/versions/2.7.12

# Now python 3.8-dev
$ pyenv install 3.8-dev     
Cloning https://github.com/python/cpython...
Installing Python-3.8-dev...
Installed Python-3.8-dev to /home/prassanna/.pyenv/versions/3.8-dev
```

#### Step 4 – Installing Pipenv

Pipenv installation is pretty straightforward. Don't forget to log into the right shell. You have to do this for every version of python that you use with pipenv!

```bash
$ pyenv shell 3.8-dev 
$ pyenv which python
/home/prassanna/.pyenv/versions/3.8-dev/bin/python
$ pip install pipenv
Installing collected packages: certifi, virtualenv-clone, virtualenv, pipenv
Successfully installed certifi-2018.8.24 pipenv-2018.7.1 virtualenv-16.0.0 virtualenv-clone-0.3.0

$ cd ..
```

#### Step 5 – Allowing for pipenv to use pyenv

It's always better for pipenv to discover pyenv python versions. This allows for seamless interoperability.

```bash
echo 'export PIPENV_PYTHON="$PYENV_ROOT/shims/python"' >> ~/.bashrc

# or to .zshrc if you have one
echo 'export PIPENV_PYTHON="$PYENV_ROOT/shims/python"' >> ~/.zshrc
```

### Usage

#### Step 1 – Play around

Having a look at pyenv

```bash
$ pyenv versions
  system
  2.7.12
  2.7.12/envs/project_env
  3.2.6
* 3.8-dev (set by PYENV_VERSION environment variable)
  project_env

$ cd my_pipenv_project 
```

Lets first check if pyenv and pipenv work. Just running pipenv barebones give us a a nice instructional page.

```bash
$ pipenv
Usage: pipenv [OPTIONS] COMMAND [ARGS]...

Options:
  --where             Output project home information.
  --venv              Output virtualenv information.
  --py                Output Python interpreter information.
  --envs              Output Environment Variable options.
  --rm                Remove the virtualenv.
  --bare              Minimal output.
  --completion        Output completion (to be eval-ed).
  --man               Display manpage.
  --three / --two     Use Python 3/2 when creating virtualenv.
  --python TEXT       Specify which version of Python virtualenv should use.
  --site-packages     Enable site-packages for the virtualenv.
  --pypi-mirror TEXT  Specify a PyPI mirror.
  --support           Output diagnostic information for use in Github issues.
  --version           Show the version and exit.
  -h, --help          Show this message and exit.


Usage Examples:
   Create a new project using Python 3.6, specifically:
   $ pipenv --python 3.6

   Install all dependencies for a project (including dev):
   $ pipenv install --dev

   Create a lockfile containing pre-releases:
   $ pipenv lock --pre

   Show a graph of your installed dependencies:
   $ pipenv graph

   Check your installed dependencies for security vulnerabilities:
   $ pipenv check

   Install a local setup.py into your virtual environment/Pipfile:
   $ pipenv install -e .

   Use a lower-level pip command:
   $ pipenv run pip freeze

Commands:
  check      Checks for security vulnerabilities and against PEP 508 markers
             provided in Pipfile.
  clean      Uninstalls all packages not specified in Pipfile.lock.
  graph      Displays currently-installed dependency graph information.
  install    Installs provided packages and adds them to Pipfile, or (if none
             is given), installs all packages.
  lock       Generates Pipfile.lock.
  open       View a given module in your editor.
  run        Spawns a command installed into the virtualenv.
  shell      Spawns a shell within the virtualenv.
  sync       Installs all packages specified in Pipfile.lock.
  uninstall  Un-installs a provided package and removes it from Pipfile.
  update     Runs lock, then sync.
```

#### Step 2 – Check out pipenv

Lets try installing stuff, getting out of the shell and back

```bash
$ pyenv shell 3.8-dev

$ pipenv shell 
```

Lets install a sample dependency – flask. Flask is a package that makes writing mircoservices very easy.  This is just for illustration purposes, and I'm skipping the output of pipenv

```bash
$ (python) pipenv install flask

$ (python) python
Python 3.8.0a0 (heads/master:df81015, Sep 30 2018, 00:28:23) 
[GCC 7.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import flask
>>> flask.__name__
'flask'
```

Before we exit the python interpreter, lets just check our python location. We see that it is a pipenv

```bash
>>> import sys; sys.executable
'/home/prassanna/.local/share/virtualenvs/pipenv_project-ny3ZaTRO-/home/prassanna/.pyenv/shims/python/bin/python'
>>> exit()
```

Lets then exit pipenv as well, and check the python version. And as we can see, flask doesn't work here

```bash
>>> import sys; sys.executable
'/home/prassanna/.local/share/virtualenvs/pipenv_project-ny3ZaTRO-/home/prassanna/.pyenv/shims/python/bin/python'
>>> exit()
```

#### Step 3 – More pipenv with more versions Pyenv

Let's try with other versions of pyenv – pipenv combinations. Lets say we have a python2project in a folder called  pipenv2_project. Lets install our pipenv environment

```bash
$ mkdir pipenv2_project

$ cd pipenv2_project 

$ pwd
    /home/prassanna/Projects/pipenv2_project

$ pyenv shell 2.7.12 

$ pip install pipenv

$ pipenv install

$ pipenv install BeautifulSoup
```

We would get some fancy output about our lock file, and then we can explore out python interpreter and we see we have the right python environment and dependencies. We log into the pipenv shell and get back

```bash
$ pipenv shell

$ python
Python 2.7.12 (default, Sep 30 2018, 00:08:38) 
[GCC 7.3.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import BeautifulSoup
>>> print BeautifulSoup.__name__
BeautifulSoup
>>> import sys; sys.executable
'/home/prassanna/.local/share/virtualenvs/pipenv2_project-sA74P2YQ-/home/prassanna/.pyenv/shims/python/bin/python'
>>> exit()

$ exit
```

We also see that once we come out of the environment, the python environment doesn't have the package, effectively showing the isolation in the environment.

```bash
Python 2.7.12 (default, Sep 30 2018, 00:08:38) 
[GCC 7.3.0] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import sys; sys.executable
'/home/prassanna/.pyenv/versions/2.7.12/bin/python'
>>> import BeautifulSoup
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ImportError: No module named BeautifulSoup
>>> exit()
```

Pipenv works fine, but what about different versions of python and you forget to activate the right shell in Pyenv in advance? Would it work? If so, should you trust pyenv or pipenv in reporting it's version? The following code is a copy-paste from earlier in this post. It gets more context here, and help you understand why we always trust pipenv.

```bash
$ cd Projects 

$ Projects ls

$ mkdir my_new_project

# Assuming pyenv is installed, and I have some nice environments
$ pyenv which python
/home/prassanna/.pyenv/versions/2.7.12/bin/python

$ cd my_new_project 

# This is pre-pipenv
$ pyenv which python
/home/prassanna/.pyenv/versions/2.7.12/bin/python

# I have 3.8-dev installed from earlier, remember?
$ my_new_project pyenv shell 3.8-dev

# I had one from before, but this would create it again anyway :)
$ pipenv install --python=`pyenv which python`
Virtualenv already exists!
Removing existing virtualenv...
Creating a virtualenv for this project...
...
Virtualenv location: /home/prassanna/.local/share/virtualenvs/my_new_project-_ivudYLh
...

# Let me go back to my previous shell
$ pyenv shell 2.7.12

# This doesnt know about pipenv
$ pyenv which python
/home/prassanna/.pyenv/versions/2.7.12/bin/python

# Lets see pipenv
$ pipenv shell
Launching subshell in virtual environment…
 . /home/prassanna/.local/share/virtualenvs/my_new_project-_ivudYLh/bin/activate

# pyenv is wrong in knowing about his shell
$ (my_new_project-_ivudYLh) pyenv which python
/home/prassanna/.pyenv/versions/2.7.12/bin/python

# Notice that it is 3.8
$ (my_new_project-_ivudYLh) python
Python 3.8.0a0 (heads/master:df81015, Sep 30 2018, 00:28:23) 
[GCC 7.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> exit()

# 3.8 as expected, pipenv works fine!
$ (my_new_project-_ivudYLh) python --version
Python 3.8.0a0

$ (my_new_project-_ivudYLh) exit 

# On exiting, the python version is back to 2.7.12
$ python --version
Python 2.7.12
```

That's it, you have a nice installation ready. If something doesn't work out, just figure it out in the links provided.


## It should be even easier.

Check out poetry and pyenv-virtualenv