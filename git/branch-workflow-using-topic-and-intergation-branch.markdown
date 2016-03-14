##[Branching workflow using topic and integration branch](https://backlogtool.com/git-guide/en/stepup/stepup1_5.html)

###Branching workflow using topic and integration branch
We will be covering the branching workflow with a simple example.

Say for instance, you are currently working on a new feature on the current branch. Suddenly, somebody finds a bug in the production and you are now tasked to fix that bug, parallel to working on the new feature earlier.

###使用开发分支和融合分支的分支工作流
我们将会通过具体的例子来讲解分支流。  
举个例子，你现在在一个新的功能分支做开发工作。突然，生产环境出现了一个Bug需要你马上去修复，和当前的新功能分支并行开发。  

![1](https://backlogtool.com/git-guide/en/img/post/stepup/capture_stepup1_5_1.png)


Before starting on the bug fix, you would want to create a new branch based off the integration branch. 

This new branch will isolate the bug fix from the new feature that you were working on.

在开始修复Bug之前，你需要基于融合分支创建新的分支。

这个新的分支会隔离功能分支对Bug修复的可见性。

![2](https://backlogtool.com/git-guide/en/img/post/stepup/capture_stepup1_5_2.png)

When you ready to release the bug fix, merge the bug fix topic branch into the integration branch.

当准备发布Bug修复时，将Bug修复分支merge到融合分支。

![3](https://backlogtool.com/git-guide/en/img/post/stepup/capture_stepup1_5_3.png) 

Once that is done, you can proceed to switch back to your original feature branch and continue working on the new feature.  
  
当这一切做完以后，你可以选择返回原来的新功能开发分支继续工作。

![4](https://backlogtool.com/git-guide/en/img/post/stepup/capture_stepup1_5_4.png)

On your feature branch, you will notice that commit "X", which is the bug fix commit, is needed in order for you to continue implementing the new feature. In other words, you will have to synchronize your current branch with the changes on the integration branch.

There are two options to go about doing this. The first is to merge the integration branch that includes commit "X" with the current branch.

The second option is to rebase the current branch to the integration branch that includes commit "X".

For this example, we will use the rebase approach which will produce a resulting history that is similar to the example below. 

在开发分支，你发现这个新修复的提交对你接下来的开发是必需的。换句话说，你需要将当前分支和融合分支进行同步。

一共有两种方案。第一种方案是将包含提交“X”的融合分支与当前分支整合。

第二种方案是将当前分支与包含提交“X”的融合分支进行rebase操作。

在这个例子中，我们选择使用rebase方案，因为它会产生类似下面的提交历史。

![5](https://backlogtool.com/git-guide/en/img/post/stepup/capture_stepup1_5_5.png)


Now that we have commit "X" on our current branch, we can safely proceed to work on our new feature.

As you can see here, branching allows us to effectively work on multiple concurrent tasks.

现在我们当前的开发分支也有了提交“X”，我们可以继续开发新功能。

同时你也能看到，分支允许我们高效的做多个并行的工作。

###Column 「A successful Git branching model」

We highly recommend that you check out the article "A successful Git branching model" at [A successful git branching model](http://nvie.com/posts/a-successful-git-branching-model/.) It covers one of the most popular approaches for managing Git branching workflow.

The article suggests that we maintain four types of branches, each with different roles.

- Main branch
- Feature branch (topic branch)
- Release branch
- Hot fix branch

###专栏 成功的git分支模型

我强烈建议你阅读 [A successful git branching model](http://nvie.com/posts/a-successful-git-branching-model/.)。这是现如今Git分支工作流中最出名的一个。

这篇文章推荐我们保持四种类型的分支，每种都有它自己的的角色。

- 主分支
- 功能分支
- 发布分支
- Bug分支

![branch at git ](https://backlogtool.com/git-guide/en/img/post/stepup/capture_stepup1_5_6.png)

####Main branch

The main branch consists of the master and develop branches.

- Master

		Codebase residing in the master branch is considered to be production-ready. When it is ready for a specific release, the latest commit will be given a release tag.
		
- Develop
 
		Codebase residing in the develop branch is used in your team's day to day development. This is where all new features are merged to, waiting to be deployed in upcoming releases. This branch is very much like the integration branch that we have described earlier in this section.
		
###主分支
主分支包含了master 和 develop分支。

- Master
		
		master分支作为代码基线被认为是可发布的。当有一个新的发布时，最后的发布将会产生一个tag。
		
- Develop
	
		develop分支作为代码基线被用来做日常的开发。所有新功能开发的代码都合并到这里，等待被发布。这个分支非常类似我们之前提到的融合分支。
	


####Feature branch

The feature branch works like a topic branch which we have covered earlier.

When you plan to start working on a new feature/bug fix, you would want to create a feature branch. A feature branch would normally be created off a develop branch. This feature branch can reside in your local machine throughout the entire development lifecycle of the feature.

You should push this branch up to the remote repository whenever you are ready to merge the change set with the develop branch.

###功能分支

这个分支和我们之前提到的新功能开发分支类似。

当你开发新功能或者修复Bug，你会创建一个新的分支。这个分支应该从develop分支创建分离。这个feature分支会在你功能开发的整个生命周期都存在你本地机器。

当你开发完成后，需要将代码推送到远程仓库中，并合并到develop分支中。 

####Release branch

When you plan to roll out a new release, you would want to create a release branch. A release branch helps you to prepare and ensure that the new features are running correctly.

By convention, release branch names normally start with the prefix "release-".

The release branch is typically created off the develop branch when it becomes close to being production-ready.

Only bug fix and release related issues should be addressed on this branch. Having this branch would allow other team members to continue pushing new features to the develop branch without interrupting the release workflow.

When you are ready to release, merge the release branch with the master branch and tag a release number to the newly created merge commit.

You would also want to merge the release branch into the develop branch, so that both the master and develop branches receive the latest change/bug fix from the release branch.

###release分支

当你准备发布代码时，你需要创建一个release分支。这个release分支能够帮助你确认所有的新功能都能够正常运行。

按照约定，所有的release版本都应该以“release-”开始。发布分支是从develop分支分离出来的。

只有修复Bug和发布相关的工作可以在这个分支完成。使用这个分支的目的是为了让其它团队的成员在发布时可以继续往develop分支合并代码。

发布之前，将发布分支与master分支合并合并并打上标签。

同时你需要将release分支往develop分支合并，这样master分支和develop分支都将会收到来自release分支最新的修改

####Hot fix branch

When you need to add an important fix to your production codebase quickly, you would want to create a Hot fix branch off the master branch.

By convention, hot fix branch names normally start with the prefix "hotfix-".

The advantage of a hot fix branch is that it allows you to quickly issue a patch and have the change merged with the master branch without having to wait for the next release.

A hot fix branch should be merged with the develop branch as well.

###Bug修复分支

当你想快速的修复生产环境的一个重要Bug时，你需要从master分支分离出一个fix修复分支。

按照约定，修复分支的名称需要以"hotfix-"开始。

使用hotfix修复分支的好处是它允许你快速的发出补丁包且直接与master合并而不用等到下一个release。

同样，hotfix分支需要和develop分支合并。
