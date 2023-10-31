package core

import "errors"

type FsObject interface {
	GetName() string
	GetParent() (FsObject, error)
	GetType() FsObjectType
}

type AbstractFsObject struct {
	Name   string
	Parent *AbstractFsObject
	Type   FsObjectType
}

func (o *AbstractFsObject) GetName() string {
	return o.Name
}

func (o *AbstractFsObject) GetParent() (FsObject, error) {
	if o.Parent == nil {
		return nil, DirectoryHasNoParentError()
	}
	return o.Parent, nil
}

func (o *AbstractFsObject) GetType() FsObjectType {
	return o.Type
}

func DirectoryHasNoParentError() error {
	return errors.New("Directory has no parent")
}
