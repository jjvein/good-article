## Rebase branch
###[Rebase branch](https://backlogtool.com/git-guide/en/stepup/stepup2_8.html)

Another approach we can take to integrate "issue3" branch into the master branch is by using the rebase command. Using rebase, we can streamline and clean our history tree just like how we have described earlier.

Let's start by undoing the previous merge.

我们也可以使用`rebase`命令将“issure3”分支整合到master分支中。使用`Rebase`，我们可以将提交历史线性化。  
首先我们将之前的merge取消。

```
$ git reset --hard HEAD~
```
![History before rabase](https://backlogtool.com/git-guide/en/img/post/stepup/capture_stepup2_8_1_1.png)

Switch over to "issue3" branch and rebase onto the master branch.

我们切换到“issue3”分支然后将该分支`rebase`到master分支。

```
$ git checkout issue3
Switched to branch 'issue3'
$ git rebase master
First, rewinding head to replay your work on top of it...
Applying: append description of the pull command
Using index info to reconstruct a base tree...
<stdin>:13: new blank line at EOF.
+
warning: 1 line adds whitespace errors.
Falling back to patching base and 3-way merge...
Auto-merging myfile.txt
CONFLICT (content): Merge conflict in myfile.txt
Failed to merge in the changes.
Patch failed at 0001 append description of the pull command

When you have resolved this problem run "git rebase --continue".
If you would prefer to skip this patch, instead run "git rebase --skip".
To check out the original branch and stop rebasing run "git rebase --abort".
```

When a conflict occurs during the rebase, you will have to resolve it immediately in order to resume the rebase operation.

当在`rebase`的过程中出现了冲突，需要立刻解决该问题，然后再继续唤醒`rebase`操作。

```
Git commands even a monkey can understand
add: Register a change in an index
<<<<<<< HEAD
commit: Save the status of an index
=======
pull: Obtain the content of a remote repository
>>>>>>> issue3
```

Once the conflict is resolved, you can resume rebase with the --continue option. If you wish to quit and rollback the rebase operation, you can do so by passing in the --abort option.

冲突解决以后，你可以通过执行命令`git rebase --continue` 来唤醒`rebase`操作。  
如果你想退出并且回滚到rebase之前的状态，可以执行命令`git rebase --abort`。

```
$ git add myfile.txt
$ git rebase --continue
Applying: append description of the pull command
```

![Current history](https://backlogtool.com/git-guide/en/img/post/stepup/capture_stepup2_8_1.png)

With the "issue3" branch rebased onto "master", we can now issue a fast-forward merge.

Switch over to the master branch and merge "issue3" with "master".

通过将“issue3”分支`rebase`到master分支，现在我们可以发出一个“fast-forward”的合并。

切换到master分支，然后将“issue3”分支合并进来。 

```
$ git checkout master
Switched to branch 'master'
$ git merge issue3
Updating 8f7aa27..96a0ff0
Fast-forward
 myfile.txt |    1 +
 1 files changed, 1 insertions(+), 0 deletions(-)
 ```
 
The content of myfile.txt should now be identical to the one that we got from the previous merge. The revision history now should look like the following.

myfile.txt的内容和之前做merge操作是一样的。但是提交版本历史看起来是线性的。 

![Current history](https://backlogtool.com/git-guide/en/img/post/stepup/capture_stepup2_8_2.png)
